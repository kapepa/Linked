import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {PostService} from "../../core/service/post.service";
import {AdditionDto} from "../../core/dto/addition.dto";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-addition-search',
  templateUrl: './addition-search.component.html',
  styleUrls: ['./addition-search.component.scss'],
})
export class AdditionSearchComponent implements OnInit, OnDestroy {
  additionSub: Subscription;

  @Input() type: string;
  @Input() query?: string;
  @Input() index?: number;
  @Input() onClosePublication: () => void;

  additionForm = this.fb.group({
    jobTitle: ['', [Validators.required, Validators.minLength(4)] ],
    company: ['', [Validators.required, Validators.minLength(4)] ],
    placesWork: ['', [Validators.required, Validators.minLength(4)] ],
    region: ['', [Validators.required, Validators.minLength(4)] ],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private postService: PostService,
  ) { }

  ngOnInit() {
    if(this.type === 'create') this.additionSub = this.postService.getCreateAddition.subscribe(( addition: AdditionDto ) => {
      this.createForm(addition);
    });

    if(this.type === 'edit') this.additionSub = this.postService.getEditAddition.subscribe(( addition: AdditionDto ) => {
      if(!!addition) return this.createForm(addition);

      // if(this.route.snapshot.queryParams?.index) this.postService.findEdit(this.route.snapshot.queryParams?.index);

    });
  }

  async ngOnDestroy() {
    let { index, edit, open, ...other} = this.route.snapshot.queryParams

    if (this.type === 'create') this.postService.setCreateAddition = this.createAddition();
    if (this.type === 'edit') this.postService.setEditAddition = this.createAddition();

    if( edit === 'addition' || open === 'addition' )
      await this.router.navigate([window.location.pathname], {queryParams: other});

    this.additionSub.unsubscribe();
  }

  createForm(addition: AdditionDto) {
    this.additionForm = this.fb.group({
      jobTitle: [ !!addition?.jobTitle ? addition.jobTitle : '', [Validators.required, Validators.minLength(4)] ],
      company: [ !!addition?.company ? addition.company : '', [Validators.required, Validators.minLength(4)] ],
      placesWork: [ !!addition?.placesWork ? addition.placesWork : '', [Validators.required, Validators.minLength(4)] ],
      region: [ !!addition?.region ? addition.region : '', [Validators.required, Validators.minLength(4)] ],
    });
  }

  createAddition(): AdditionDto {
    return {
      ...(!!this.getJob.value) ? { jobTitle: this.getJob.value } : undefined,
      ...(!!this.getCompany.value) ? { company: this.getCompany.value } : undefined,
      ...(!!this.getPlace.value) ? { placesWork: this.getPlace.value } : undefined,
      ...(!!this.getRegion.value) ? { region: this.getRegion.value } : undefined,
    } as AdditionDto
  }

  onClose(e: Event) {
    this.onClosePublication();
  }

  async onSubmit(e: Event) {
    this.postService.setCreateAddition = this.additionForm.value;
    await this.router.navigate(['/home'],
      { queryParams: {...this.type === 'create' ? { open: 'create' } : { edit: this.query, index: this.index } } }
    );
  }

  get getJob() {
    return this.additionForm.get('jobTitle');
  }

  get getCompany() {
    return this.additionForm.get('company');
  }

  get getPlace() {
    return this.additionForm.get('placesWork');
  }

  get getRegion() {
    return this.additionForm.get('region');
  }
}
