import { NextResponse } from "next/server";
import groq from "@/lib/groq";
import { getTrainData } from "@/lib/railway";
import { answerTrainQuery } from "@/lib/trainQuery";
import { answerStationQuery }
from "@/lib/stationQuery";
import { answerJourneyQuery }
from "@/lib/journeyQuery";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      message,
      type,
      messages = [],
    } = body;

    // Direct train number search
    if (type === "train") {
      const data = await getTrainData(message);

      return NextResponse.json({
        success: true,
        reply: JSON.stringify(data),
      });
    }

    // MongoDB-powered railway copilot
const dbAnswer =
  (await answerTrainQuery(message)) ||
  (await answerStationQuery(message));

if (dbAnswer) {
  return NextResponse.json({
  success: true,
  reply: dbAnswer,
});
}

const journeyAnswer =
  await answerJourneyQuery(message);

if (journeyAnswer) {
  return NextResponse.json({
    success: true,
    reply: journeyAnswer,
  });
}
    // Fallback to Groq AI
    const completion =
      await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",

        messages: [
          {
            role: "system",
            content: `
You are RailTrace AI,
an intelligent Indian Railways copilot.

You help users with:
- trains
- routes
- delays
- railway insights
- trip planning
- conversational railway guidance

IMPORTANT:
Always return valid JSON only.

Response format:
{
  "title": "",
  "summary": "",
  "status": "",
  "details": {
    "trainNumber": "",
    "trainName": "",
    "source": "",
    "destination": "",
    "duration": ""
  },
  "route": [
    {
      "stationCode": "",
      "stationName": ""
    }
  ]
}

Use realistic railway statuses like:
- LIVE
- DELAYED
- ARRIVED
- CANCELLED
- RESCHEDULED
- ON TIME

No markdown.
No explanation outside JSON.
`,
          },

          ...messages,
        ],
      });

    return NextResponse.json({
      success: true,
      reply:
        completion.choices[0]?.message
          ?.content,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "AI request failed",
      },
      {
        status: 500,
      }
    );
  }
}