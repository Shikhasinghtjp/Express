export const ValidationSchema={
    username:{
        isLength:{
            options:{
                min: 5 ,
                max:32,
            },
            errorMessage: 'Username must be between 5 and 32 characters',
        },
        notEmpty: {
            errorMessage: 'Username is required',
        },
        isString: {
            errorMessage: 'Username must be a string',
        },
        displayName:{
            notempty:{
                errorMessage: 'Display name is required',
            }
        }
    }
}