import React, { useContext } from 'react'

import useForm from '../../shared/components/hooks/form-hook'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/components/Util/Validator"
import ErrorModal from '../../shared/components/UIElements/ErrorModal';



import { useHttpClient } from '../../shared/components/hooks/http-hook'
import AuthContext from '../../shared/components/context/auth-context'


import './PlaceForm.css'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

/*
    Page component where user can fill out form and add a new place
*/
export const NewPlace = () => {

    // Get Access to information in our custom context
    const auth = useContext(AuthContext);

    const { sendRequest, isLoading, error, clearError } = useHttpClient()

    // Custom Hook needs object of inputs, and initial form validity
    const [formState, inputHandler] = useForm({

        // isValids are initially false because when creating new place fields should be empty(which fails validation)

        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        }

    },
        false
    )

    const placeSubmitHandler = async event => {

        // Prevent form from refreshing page which would ruin react render
        event.preventDefault();

        try {

            await sendRequest('http://localhost:5000/api/places/',
                'POST',
                JSON.stringify({
                    title: formState.inputs.title,
                    address: formState.inputs.address,
                    description: formState.inputs.description,
                    creator: auth.userId // gets unique userId from context
                }),
                {
                    'Content-Type': 'application/json'
                }
            )

        } catch (error) {
            // errors handled in hook using send request
        }


        // console.log(formState.inputs) // Will be able to send this to back end
    }


    return (

        <React.Fragment>

            <ErrorModal error={error} onClear={clearError} />>

            {isLoading && <LoadingSpinner asOverlay />}

            <form className="place-form" onSubmit={placeSubmitHandler}>

                {/* All Inputs change different properties of the same state */}

                <Input
                    id='title'
                    element='input'
                    type='text'
                    label='Title'
                    // VALIDATOR CHECKS IF INPUT IS EMPTY 
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={inputHandler}
                    errorText='Please Enter a valid title'
                />

                <Input
                    id='description'
                    element='textarea'
                    label='Description'
                    // VALIDATOR CHECKS IF INPUT IS EMPTY 
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText='Please Enter a valid description(at least 5 characters).'
                    onInput={inputHandler}
                />
                
                <Input
                    id='address'
                    element='input'
                    type='text'
                    label='Adress'
                    // VALIDATOR CHECKS IF INPUT IS EMPTY 
                    validators={[VALIDATOR_REQUIRE()]}
                    onInput={inputHandler}
                    errorText='Please Enter a valid address'
                />

                <Button type='submit' disabled={!formState.isValid}>
                    ADD PLACE
                </Button>

            </form>

        </React.Fragment>

    )

}
