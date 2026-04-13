import { Sword, Shield, Zap, Heart, Brain, Briefcase, Users, Palette } from "lucide-react";

export const DIFFICULTIES = [
  { value: "easy", label: "Easy", xp: 10, icon: Shield, color: "#2cb67d" },
  { value: "medium", label: "Medium", xp: 25, icon: Zap, color: "#ffb84d" },
  { value: "hard", label: "Hard", xp: 50, icon: Sword, color: "#ff6b81" },
];

export const SKILLS = [
  { value: "health", label: "Health", icon: Heart },
  { value: "mind", label: "Mind", icon: Brain },
  { value: "career", label: "Career", icon: Briefcase },
  { value: "social", label: "Social", icon: Users },
  { value: "creativity", label: "Creativity", icon: Palette },
];
