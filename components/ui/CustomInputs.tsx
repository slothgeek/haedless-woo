'use client';

import { gql, useQuery } from '@apollo/client';
import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { getCountryName } from '@/lib/utils/helpers';
import { useEffect, useState } from 'react';

const GET_COUNTRIES = gql`
    query GetCountries {
        countries
    }
`;

const GET_ALLOWED_COUNTRIES = gql`
    query GetAllowedCountries {
        allowedCountries
    }
`;

const GET_STATES = gql`
    query GetStates($country: CountriesEnum!) {
        countryStates(country: $country){
            name
            code
        }
    }
`;

interface CountriesSelectProps {
    allowedCountries?: boolean;
    name?: string;
    defaultCountry?: string;
    onSelectionChange?: (value: string) => void;
    defaultValue?: string;
    error?: string;
    value?: string;
    onChange?: (value: string) => void;
}

export function CountriesSelect({
    allowedCountries,
    name,
    defaultCountry,
    onSelectionChange,
    defaultValue,
    error,
    value,
    onChange
}: CountriesSelectProps) {
    const { data, loading, error: queryError } = useQuery(allowedCountries ? GET_ALLOWED_COUNTRIES : GET_COUNTRIES);
    const [selectedCountry, setSelectedCountry] = useState(value || defaultCountry || '');

    useEffect(() => {
        if (value !== undefined) {
            setSelectedCountry(value);
        }
    }, [value]);

    if (loading) return (
        <div className="w-full">
            <div className="animate-pulse bg-gray-200 h-10 rounded-md"></div>
        </div>
    );
    
    if (queryError) return (
        <div className="w-full p-2 bg-red-50 text-red-700 rounded-md" role="alert">
            Error: {queryError.message}
        </div>
    );

    const countries = allowedCountries ? data.allowedCountries : data.countries;

    return (
        <div className="w-full">
            <input type="hidden" name={name || 'country'} value={value || selectedCountry} />
            <Autocomplete
                className={`w-full ${error ? 'border-red-500' : ''}`}
                defaultItems={countries.map((country: string) => ({
                    key: country,
                    label: getCountryName(country)
                }))}
                label="País"
                placeholder="Buscar país"
                onSelectionChange={(key) => {
                    const newValue = key as string;
                    setSelectedCountry(newValue);
                    onChange?.(newValue);
                    onSelectionChange?.(newValue);
                }}
                defaultSelectedKey={value || selectedCountry}
                aria-invalid={!!error}
                aria-describedby={error ? `${name || 'country'}-error` : undefined}
            >
                {(item: any) => ( 
                    <AutocompleteItem key={item.key}>
                        {getCountryName(item.key)}
                    </AutocompleteItem>
                )}
            </Autocomplete>
            {error && (
                <p id={`${name || 'country'}-error`} className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    )
}

interface StatesSelectProps {
    country: string;
    defaultValue?: string;
    error?: string;
    value?: string;
    onChange?: (value: string) => void;
}

export function StatesSelect({
    country,
    defaultValue,
    error,
    value,
    onChange
}: StatesSelectProps) {
    const [selectedState, setSelectedState] = useState(value || defaultValue || '');
    const { data, loading, error: queryError } = useQuery(GET_STATES, {
        variables: { country: country as any },
        skip: !country
    });

    useEffect(() => {
        if (value !== undefined) {
            setSelectedState(value);
        }
    }, [value]);

    if (loading) return (
        <div className="w-full">
            <div className="animate-pulse bg-gray-200 h-10 rounded-md"></div>
        </div>
    );
    
    if (queryError) return (
        <div className="w-full p-2 bg-red-50 text-red-700 rounded-md" role="alert">
            Error: {queryError.message}
        </div>
    );
    
    if (!country) return null;

    return (
        <div className="w-full">
            <input type="hidden" name="state" value={value || selectedState} />
            <Autocomplete
                className={`w-full ${error ? 'border-red-500' : ''}`}
                defaultItems={data?.countryStates?.map((state: any) => ({
                    key: state.code,
                    label: state.name
                })) || []}
                label="Estado"
                placeholder="Buscar estado"
                onSelectionChange={(key) => {
                    const newValue = key as string;
                    setSelectedState(newValue);
                    onChange?.(newValue);
                }}
                defaultSelectedKey={value || selectedState}
                aria-invalid={!!error}
                aria-describedby={error ? 'state-error' : undefined}
            >
                {(item: any) => (
                    <AutocompleteItem key={item.key}>
                        {item.label}
                    </AutocompleteItem>
                )}
            </Autocomplete>
            {error && (
                <p id="state-error" className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    )
}
