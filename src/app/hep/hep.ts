import { TemplateService } from './../template/service/template.service'


export class HEP {
    /* 
    This class represents a Home Exercise Program (HEP). The HEP class can represent EITHER a HEP that
    has been assigned to a patient OR a HEP template which can be used to quickly assign custom HEPs
    to patient users.

    If the template_id property is set to null this represents a HEP template. Otherwise, the template_id
    indicates which treatent plan the HEP is assigned to.
    */

    private _template_id: number = null;
    private _clinic_id: number;
    private _exercises: number[];

    constructor(public templateService: TemplateService, clinic_id: number, exercises?: number[], template_id?: number, ) {}

    public from(hep: HEP) {
        this.clinic_id = hep.clinic_id;
        this.exercises = hep.exercises;
        this.template_id = null; // insert proper code here

    }

    public add(assigned_exercise_id: number) {
        // function only invoked within the from() method
        this._exercises.push(assigned_exercise_id);
    }

    // public newExercise(exercise) {
    //     // invoke template service that creates a new assigned_exercise from the param exercise
    //     this.templateService.createExercise(exercise).subscribe( res => {
    //         this._exercises.push(res.assigned_exercise_id);
    //     })
    // }

    public remove(assigned_exercise_id: number) {
        let index = this._exercises.indexOf(assigned_exercise_id);
        if (index > -1) {
            this._exercises.splice(index, 1);
        }else {
            throw new Error("Exercise Not Found");
        }
    }

    get clinic_id(): number {
        return this._clinic_id;
    }

    set clinic_id(value: number) {
        this._clinic_id = value;
    }

    get template_id(): number {
        return this._template_id;
    }

    set template_id(value: number) {
        this._template_id = value;
    }

    get exercises() {
        return this._exercises;
    }

    set exercises(array) {
        this._exercises = array;
    }
 
}