export default interface game {
  id: string;
  name: string;
  description:  string | null;
  min_players: number | null;
  max_players: number | null;
  min_playtime: number | null;
  max_playtime: number | null;
  min_age: number | null;
  thumb_url: string | null;
  image_url: string | null;
  rules_url: string | null;
  official_url: string | null;
  year_published: number | null;
  category: string | null;
  difficulty: string | null;
  bgg_rating: string | null;
  game_type: [string] | null;
  best_player_count: string | null;
  is_classic: boolean | null;
  is_coop: boolean | null;
  is_party: boolean | null;
  is_expansion: boolean | null;
  bgg_id: string | null;
  bgg_description: string | null;
}
