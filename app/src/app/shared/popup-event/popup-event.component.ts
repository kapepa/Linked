import {Component, OnInit, OnDestroy, Input, ViewChild, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {EventService} from "../../core/service/event.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-popup-event',
  templateUrl: './popup-event.component.html',
  styleUrls: ['./popup-event.component.scss'],
})
export class PopupEventComponent implements OnInit, OnDestroy {
  @ViewChild('inputFile') inputFile: ElementRef<HTMLInputElement>;

  @Input('closeEvent') closeEvent: () => void;

  eventForm: FormGroup = this.fb.group({
    img: new FormControl<File | string>('', [Validators.required] ),
    type: new FormControl<string>('online', [Validators.required]),
    title: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    date: new FormControl<Date>(null,[Validators.required]),
    time: new FormControl<Date>(null,[Validators.required]),
    link: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>('', [Validators.required, Validators.minLength(10)]),
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
  ) { }

  ngOnInit() {}

  ngOnDestroy() {}

  onClose(e: Event) {
    this.closeEvent();
  }

  onEmpty(e: Event) {
    this.inputFile.nativeElement.click();
  }

  onSubmit(e: Event) {
    this.eventService.createEvent(this.eventForm.value).subscribe({
      next: () => this.closeEvent(),
    });
  };

  onChange(e: Event) {
    let file = (e.target as HTMLInputElement).files[0];
    this.getImg.setValue(file);
  }

  onRadioChange(val: string) {
    this.getType.setValue(val);
  }

  get getImg() {
    return this.eventForm.get('img');
  }

  get getType() {
    return this.eventForm.get('type');
  }

  get getTitle() {
    return this.eventForm.get('title')
  }

  get getDate() {
    return this.eventForm.get('date');
  }

  get getTime() {
    return this.eventForm.get('time');
  }

  get getLink() {
    return this.eventForm.get('link');
  }

  get getDescription() {
    return this.eventForm.get('description');
  }
}
