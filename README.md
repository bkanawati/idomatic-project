# IdomaticProject

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

If `ng serve` does not work, just run the script manually `npm start`

# Functionality

## Filter
- Filter will only be erased if manually erased or page is refreshed.
- A `like` search method is applied to the `surnames` in the list. 
   - Ex: If `B` or `b` is inserted (does not matter if lower case or upper case), the list will filter all the surnames that `CONTAIN` those letters.  

## Create
- Button is always enabled.
- Adds the new `name` and `surname` to the list if and only if they DO NOT already exist in the list. To avoid repetitive names. 

## Update
- Button is disabled and is only enabled if a name is selected from the `list`.
- Updates the selected name with the new name typed in the `list`.

## Delete 
- Button is disabled and is only enabled if a name is selected from the `list`.
- Removes the selected name from the `list`.

## On Refresh
- The list will not be lost. It is stored in the local storage of your web device. 
- If you want to restart that list, please run the following command in your console `localStorage.removeItem('Array')`.

### Libraries used:
- Angular Material
- Lodash 
- RxJS (Observables) 

