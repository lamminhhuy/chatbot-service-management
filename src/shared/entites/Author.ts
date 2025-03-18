import { Role } from "../enums/Role";

export class Author {
  role: Role;
  name: string | null;
  metadata: Record<string, any> | null;

  constructor(
    role: Role,
    name: string | null,
    metadata: Record<string, any> | null
  ) {
    this.role = role;
    this.name = name;
    this.metadata = metadata;
  }
}
