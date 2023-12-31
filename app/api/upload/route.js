import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import OpenAI from "openai";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

export async function POST(request) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("user");
    console.log(user.id);

    // check if user
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "user isn't signed in",
        },
        { status: 403 }
      );
    }

    // get the incoming request body
    const incomingRequest = await request.json();

    // The name of your Azure OpenAI Resource.
    // https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/create-resource?pivots=web-portal#create-a-resource
    const resource = process.env.AZURE_OPENAI_RESOURCE;

    // Corresponds to your Model deployment within your OpenAI resource, e.g. my-gpt35-16k-deployment
    // Navigate to the Azure OpenAI Studio to deploy a model.
    const model = process.env.AZURE_OPENAI_MODEL;

    // https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#rest-api-versioning
    const apiVersion = "2023-06-01-preview";

    const apiKey = process.env["AZURE_OPENAI_API_KEY"];
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error:
          "The AZURE_OPENAI_API_KEY environment variable is missing or empty.",
      });
    }

    // Azure OpenAI requires a custom baseURL, api-version query param, and api-key header.
    const openai = new OpenAI({
      apiKey,
      baseURL: `https://${resource}.openai.azure.com/openai/deployments/${model}`,
      defaultQuery: { "api-version": apiVersion },
      defaultHeaders: { "api-key": apiKey },
    });

    const result = await openai.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      temperature: 0,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that extracts data from letters sent to a GP (A doctors General Practise) and pays special attention to identifying snomed codes. You only produce 2 or 3 Next Actions. Your summaries should be 2-3 sentences. You can determine if a document requires urgent action. ", // set the personality of the AI
        },
        {
          role: "user",
          content: `This is the contents of a letter to a Doctors surgery {"letterContents": "${incomingRequest.letterContents}"}. Please extract the following in this JSON template: {"Summary":"","Next Actions":[""],"Key Diagnosis":"","Any New Medication":"", "Ugrency":"Urgent or Non-Urgent","Snomed Codes and Attributes":[{"Code":"","Code Description":"", "Attribute":""}]}`, // set the prompt to the user's input
        },
      ],
    });

    if (result.choices[0].message?.content) {
      // save the response:
      const saveExtractedData = async () => {
        const { data, error } = await supabase
          .from("documents")
          .insert({
            user_id: user.id,
            doc_name: incomingRequest.filename,
            doc_data: JSON.parse(result.choices[0].message?.content),
            time_started: incomingRequest.timeStarted,
          })
          .select("id")
          .single();

        return { data, error };
      };

      const saveExtractedDataResult = await saveExtractedData();

      if (saveExtractedDataResult.error) {
        return NextResponse.json({
          success: false,
          error: saveExtractedDataResult.error,
        });
      }

      return NextResponse.json({
        success: true,
        id: saveExtractedDataResult.data.id,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "Unable to detect response from AOAI service",
      });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
