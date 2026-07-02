import type { Host } from "../types";
import { avatarFor } from "./images";

export const hostsMock: Host[] = [
  {
    id: "host-yasmine",
    name: "Yasmine El Fassi",
    avatarUrl: avatarFor("women", 12),
    responseRate: 99,
    responseTime: "within an hour",
    joinedYear: 2019,
    bio: "Curates riads and villas across Marrakech and Essaouira for LUMA.",
  },
  {
    id: "host-karim",
    name: "Karim Benjelloun",
    avatarUrl: avatarFor("men", 23),
    responseRate: 98,
    responseTime: "within an hour",
    joinedYear: 2020,
    bio: "Oversees LUMA's coastal collection in Tangier and Agadir.",
  },
  {
    id: "host-lea",
    name: "Léa Moreau",
    avatarUrl: avatarFor("women", 34),
    responseRate: 100,
    responseTime: "within 30 minutes",
    joinedYear: 2021,
    bio: "Manages LUMA's design-led residences in Casablanca.",
  },
  {
    id: "host-omar",
    name: "Omar Idrissi",
    avatarUrl: avatarFor("men", 45),
    responseRate: 97,
    responseTime: "within a few hours",
    joinedYear: 2018,
    bio: "Longtime LUMA host across Rabat and Chefchaouen.",
  },
  {
    id: "host-sofia",
    name: "Sofia Andrade",
    avatarUrl: avatarFor("women", 56),
    responseRate: 99,
    responseTime: "within an hour",
    joinedYear: 2022,
    bio: "Concierge lead for LUMA's flagship villas.",
  },
];
