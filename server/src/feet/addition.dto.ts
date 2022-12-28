import {FeetDto} from "./feet.dto";
import {ApiProperty} from "@nestjs/swagger";

export class AdditionDto {
  @ApiProperty()
  id?: string;

  @ApiProperty({ type: () => FeetDto })
  post?: FeetDto;

  @ApiProperty()
  jobTitle?: string;

  @ApiProperty()
  company?: string;

  @ApiProperty()
  placesWork?: string;

  @ApiProperty()
  region?: string;
}
