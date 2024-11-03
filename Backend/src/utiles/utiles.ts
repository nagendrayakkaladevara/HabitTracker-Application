import { IHabit } from "../models/Habit";

export function calculateProductivityPercentage(habit: IHabit): number {
    const today = new Date();
    const { startDate, completedDates, repeat } = habit;
    let totalTargetDays = 0;

    // Calculate the total target days based on the repeat frequency
    if (repeat.type === 'daily') {
        const daysElapsed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        totalTargetDays = daysElapsed + 1; // Including the start day
    } else if (repeat.type === 'custom' && repeat.daysOfWeek) {
        // Count the number of target days (e.g., "Monday" and "Wednesday") from startDate to today
        const dayOfWeekSet = new Set(repeat.daysOfWeek);
        let currentDate = new Date(startDate);
        while (currentDate <= today) {
            if (dayOfWeekSet.has(currentDate.toLocaleDateString('en-US', { weekday: 'long' }))) {
                totalTargetDays++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }
    // Add additional custom handling if needed for 'custom' repeat

    // Number of days habit was completed
    const completedDays = completedDates.length;

    // Calculate productivity as a percentage
    const productivityPercentage = totalTargetDays > 0 ? (completedDays / totalTargetDays) * 100 : 0;

    return Math.min(Math.max(Math.round(productivityPercentage), 0), 100); // Ensure it's between 0 and 100
}