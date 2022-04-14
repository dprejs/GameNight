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
}
