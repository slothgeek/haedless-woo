'use client';

import { Button } from '@heroui/react';
import { LuPlus, LuMinus } from 'react-icons/lu';

export default function QuantityInput({ value, isDisabled, onChange }: { value: number, isDisabled: boolean, onChange: (value: number) => void }) {

    return (
        <div className='flex items-center border border-gray-300 rounded-full p-2'>
            <Button color='default' radius='full' size='sm' onPress={() => onChange(value - 1)} isIconOnly isDisabled={isDisabled}><LuMinus /></Button>
            <input type="text" value={value} onChange={(e) => onChange(Number(e.target.value))} className='w-12 text-center' disabled={isDisabled} />
            <Button color='default' radius='full' size='sm' onPress={() => onChange(value + 1)} isIconOnly isDisabled={isDisabled}><LuPlus /></Button>
        </div>
    )
}