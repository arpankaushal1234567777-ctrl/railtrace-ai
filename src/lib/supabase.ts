import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export async function saveSearch(
  query: string,
  queryType: string
) {
  const { error } = await supabase
    .from("search_history")
    .insert([
      {
        query,
        query_type: queryType,
      },
    ]);

  if (error) {
    console.error(error);
  }
}

export async function getRecentSearches() {
  const { data, error } = await supabase
    .from("search_history")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(5);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}