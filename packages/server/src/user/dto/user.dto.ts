export class UpdateProfileDto {
  nickname?: string;
  avatar_url?: string;
  gender?: string;
  phone?: string;
  bio?: string;
}

export class ChangePasswordDto {
  password!: string;
}
