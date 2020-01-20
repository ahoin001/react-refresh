import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useForm from '../../shared/components/hooks/form-hook'

import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/components/Util/Validator";
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';


import './PlaceForm.css'

const DummyData = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'Super famous sky scraper',
        imageUrl: 'data:image/jpeg;base64,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',
        adress: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Death Star',
        description: 'Super planet destroyer',
        imageUrl: 'data:image/jpeg;base64,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',
        adress: '20 W 34th St, New York, NY 10001',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    }
]

const UpdatePlace = props => {

    // Temperary for fix of loading screen
    const [isLoading, setIsLoading] = useState(true)

    // Get the parameter/argument from :placeId in  /place/:placeId route
    const placeId = useParams().placeId

    // Form State will be returned state of this components form
    // Input Handler used to update state given to useFrom Hook
    // 
    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
        },
        true)

    // Find the place the user wants to edit by ID
    const identifiedPlace = DummyData.find(place => place.id === placeId)


    // Will run when identified place is found
    useEffect(() => {

        if (identifiedPlace) {
            setFormData({
                title: {
                    value: identifiedPlace.title,
                    isValid: true
                },
                description: {
                    value: identifiedPlace.description,
                    isValid: true
                }
            }, true);

        }

        setIsLoading(false)

    }, [ setFormData, identifiedPlace])


    const placeUpdateSubmitHandler = (e) => {


        e.preventDefault();

        console.log(formState.inputs)

    }

    if (!identifiedPlace) {

        return (

            <Card>
                <div className='center'>
                    <h2>COULD NOT FIND REQUESTED PLACE</h2>
                </div>
            </Card>
        )

    }

    if (isLoading) {
        return (

            <div className='center'>

                <h2> Loading ...</h2>

            </div>

        )
    }


    return (

        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>

            {/* All Inputs change different properties of the component state */}

            <Input
                id='title'
                element='input'
                type='text'
                label='Title'
                // VALIDATOR CHECKS IF INPUT IS EMPTY 
                validators={[VALIDATOR_REQUIRE()]}
                onInput={inputHandler}
                errorText='Please Enter a valid title'
                initialValue={formState.inputs.title.value}
                initialValid={formState.isValid}
            />

            <Input
                id="description"
                element='textarea'
                type="text"
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description with at least 5 characters"
                onInput={inputHandler}
                initialValue={formState.inputs.description.value}
                initialValid={true}
            />

            <Button type='submit' disabled={!formState.isValid} >
                UPDATE PLACE
        </Button>

        </form>

    );


}

export default UpdatePlace
