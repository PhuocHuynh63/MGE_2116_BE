import { registerDecorator, ValidationOptions } from "class-validator";

export const IsNotInPast = (validationOptions: ValidationOptions) => {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isNotInPast",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    // Check if the current date is not in the past
                    const currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);

                    // Convert the input date to a Date object
                    const inputDate = new Date(value);
                    inputDate.setHours(0, 0, 0, 0);

                    return inputDate >= currentDate;
                },
                defaultMessage(validationArguments) {
                    return `${validationArguments.property} should not be in the past`;
                }
            }
        });
    }
}