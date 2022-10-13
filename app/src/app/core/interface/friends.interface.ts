import {UserInterface} from "./user.interface";

export type Status = "pending" | "override" | "accepted";

export interface FriendsInterface {
  id?: string;
  user?: UserInterface;
  friends?: UserInterface;
  status?: Status;
  created_at?: Date;
}
