import {UserClass} from "./user-class";
import {AdditionInterface} from "../app/core/interface/addition.interface";
import {AdditionDto} from "../app/core/dto/addition.dto";

export const AdditionClass = {
  id: 'additionID',
  post: UserClass,
  jobTitle: 'additionTitle',
  company: 'additionCompany',
  placesWork: 'workTitle',
  region: 'regionTitle',
} as AdditionInterface | AdditionDto;
