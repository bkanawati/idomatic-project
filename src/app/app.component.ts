import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, of, combineLatest, Subject, merge } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { findIndex } from 'lodash';

interface List {
  name: string,
  surname: string,
  value: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'idomatic-project';
  form: FormGroup;                //contained name and surname text fields controls
  T_prefix: FormControl;          //filter control
  selectedValue: FormControl;     //selected value from the given list
  L$: Observable<List[]>          //original list
  filteredL$: Observable<List[]>; //filtered list
  private T_prefix$ = new Subject<string>(); //filter subject that listens on the filter control change

  initialList = [
    {name: "Black", surname: "Bear", value: "Black Bear"},
    {name: "White", surname: "Bear", value: "White Bear"},
    {name: "Red", surname: "Monkey", value: "Red Monkey"},
    {name: "Blue", surname: "Monkey", value: "Blue Monkey"},
    {name: "Green", surname: "Deer", value: "Green Deer"}
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      T_name: this.fb.control(''),
      T_surname: this.fb.control(''),
    });
    this.T_prefix = this.fb.control('');
    this.selectedValue = this.fb.control('', Validators.required);
    this.filteredL$ = of([]);

    let val: any = localStorage.getItem('Array');
    if (!val) {
      localStorage.setItem('Array', JSON.stringify(this.initialList));
    }
    this.L$ = of(JSON.parse(val));
  }

  //list filter function, listens on the T_prefix value change
  filterList(): Observable<List[]> {
    return combineLatest([this.L$, this.T_prefix$.pipe(startWith(this.T_prefix.value))])
      .pipe(
        map(([list, filter]) => list.filter(val => val.surname.toLowerCase().includes(filter.toLowerCase())))
      );
  }

  //Sets the name and surname values based on selection
  changeSelectedValue(value: string) {
    let name = value.split(' ')[0].trim();
    let surname = value.split(' ')[1].trim();
    this.form.patchValue({T_name: name, T_surname: surname});
    this.selectedValue.setValue(value);
  }

  //creates the object that will be inserted into the list
  createListObject() {
    return {
      name: this.form.get('T_name')?.value,
      surname: this.form.get('T_surname')?.value,
      value: `${this.form.get('T_name')?.value} ${this.form.get('T_surname')?.value}`
    }
  }

  //adds names to the list if it did not already exist
  onCreate() {
    let newList = this.createListObject();
    this.L$.subscribe((currentList) => {
      let match = currentList.filter((l) => l.value.toLowerCase() === newList.value.toLowerCase());
      let result = match.length ? currentList : currentList.push(newList);
      localStorage.setItem('Array', JSON.stringify(currentList));
      return result;
    });
    this.selectedValue.setValue(newList.value);
    this.filteredL$ = this.filterList();
  }

  //replaces names with selected names in the list
  onUpdate() {
    let newList = this.createListObject();
    this.L$.subscribe((currentList) => {
      let index = findIndex(currentList, {"name": this.selectedValue.value.split(' ')[0].trim(), "surname": this.selectedValue.value.split(' ')[1].trim(), "value": this.selectedValue.value});
      let result = index ? currentList[index] = newList : currentList;
      localStorage.setItem('Array', JSON.stringify(currentList));
      return result;
    });
    this.selectedValue.setValue(newList.value);
    this.filteredL$ = this.filterList();
  }

  //removes the names for the list
  onDelete() {
    let newList = this.createListObject();
    this.L$.subscribe((currentList) => {
      let index = findIndex(currentList, {"name": this.selectedValue.value.split(' ')[0].trim(), "surname": this.selectedValue.value.split(' ')[1].trim(), "value": this.selectedValue.value});
      let result = currentList.splice(index, 1)
      localStorage.setItem('Array', JSON.stringify(currentList));
      return result;
    });
    this.selectedValue.setValue(newList.value);
    this.filteredL$ = this.filterList();
    this.form.reset();
  }

  ngOnInit() {
    let val: any = localStorage.getItem('Array');
    if (!val) {
      localStorage.setItem('Array', JSON.stringify(this.initialList));
    }
    this.L$ = of(JSON.parse(val))
    this.filteredL$ = this.filterList();
    this.T_prefix.valueChanges.subscribe(val => this.T_prefix$.next(val));
  }
}
