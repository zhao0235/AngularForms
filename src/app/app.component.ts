import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ReactiveForms';
  reactiveForm: FormGroup;
  formStatus;

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      // Group of form controls using FormGroup
      personalDetails: new FormGroup({
        firstname: new FormControl(null, [
          Validators.required,
          this.noSpaceAllowed, //Custom Validation
        ]),
        lastname: new FormControl(null, [
          Validators.required,
          this.noSpaceAllowed,
        ]),
        email: new FormControl(
          null,
          [Validators.required, Validators.email],
          this.emailNotAllowed
        ),
      }),
      gender: new FormControl('male'), //set default value
      country: new FormControl('india'),
      hobbies: new FormControl(null),
      // Group of form controls using FormArray
      skills: new FormArray([new FormControl(null, Validators.required)]),
    });

    // this.reactiveForm
    //   .get('personalDetails.firstname')
    //   .valueChanges.subscribe((value) => {
    //     console.log(value);
    //   });

    // this.reactiveForm.valueChanges.subscribe((value) => {
    //   console.log(value);
    // });

    this.reactiveForm.statusChanges.subscribe((value) => {
      console.log(value);
      this.formStatus = value;
    });

    // How to use setValue method
    // setTimeout(() => {
    //   this.reactiveForm.setValue({
    //     personalDetails: {
    //       firstname: '',
    //       lastname: '',
    //       email: 'abc@example.com',
    //     },
    //     gender: '',
    //     country: '',
    //     hobbies: '',
    //     skills: [],
    //   });
    // }, 4000);

    // How to use patchValue method
    setTimeout(() => {
      this.reactiveForm.patchValue({
        personalDetails: {
          email: 'abc@example.com',
        },
      });
    }, 4000);
  }

  onSubmit() {
    console.log(this.reactiveForm);
    this.reactiveForm.reset({
      personalDetails: {
        firstname: '',
        lastname: '',
        email: '',
      },
      gender: 'male',
      country: 'india',
      hobbies: '',
      skills: [],
    });
  }

  addSkills() {
    (<FormArray>this.reactiveForm.get('skills')).push(
      new FormControl(null, Validators.required)
    );
  }

  noSpaceAllowed(control: FormControl) {
    if (control.value != null && control.value.indexOf(' ') != -1) {
      return { noSpaceAllowed: true };
    }
    return null;
  }

  //custom async validator
  emailNotAllowed(control: FormControl): Promise<any> | Observable<any> {
    const response = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'tobeupdate@gmail.com') {
          resolve({ emailNotAllowed: true });
        } else {
          resolve(null);
        }
      }, 5000);
    });
    return response;
  }
}

// From Controls can be grouped in two ways:
// 1. Using FormGroup
// 2. Using FormArray

//Async validator is used when need to sent HTTP request to the server to check if the data is valid
