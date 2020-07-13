export interface AssignedExercise {
    id: number;
    exercise_id: number;
    treatment_id: number;
    description: string;
    perform: string;
    reps: number;
    sets: number;
    tbl_exercise: {
        id: number;
        group_id: number;
        injury_id: string;
        title: string;
        image: string;
        purpose: string;
        description: string;
        is_active: number;
    }

}
