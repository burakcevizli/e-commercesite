import React, { useEffect, useState, useSyncExternalStore } from 'react'
import OrderSummary from './OrderSummary'
import { api } from '../api/api'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setLastSelectedAddress } from '../store/actions/shoppingCardActions';

export const PayingConfirmPage = () => {
    const [addressArray, setAddressArray] = useState([])
    const [isTrueOrFalse, setTrueOrFalse] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [newAddress, setNewAddress] = useState(false)
    const dispatch = useDispatch()
    const [selectedItem, setSelectedItem] = useState(null);
    const lastSelectedAddress = useSelector((select) => select?.shopping?.lastSelectedAddres)

    const handleRadioChange = (index) => {
        setSelectedItem(index);
        const selectedAddress = addressArray[index];
        dispatch(setLastSelectedAddress(selectedAddress));
    };


    const onSubmit = (data) => {
        console.log("Form data ", data)
        try {
            console.log("Burda try catch gircek mi")
            api.post("/user/address", data).then((response) => {
                console.log("Successfully submitted address:", response.data);
                setNewAddress(false)
                setTrueOrFalse(false)
            });
            console.log("BURDADA CIKMASI LAZIM")
        } catch (error) {
            console.error("Error submitting address:", error);
        }
    };


    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await api.get("user/address");
                console.log("API response:", response);
                setAddressArray(response.data);
            } catch (error) {
                console.log("Error fetching addresses:", error);
            }
        };

        fetchAddresses();
    }, [newAddress]);

    return (
        <div className='flex'>
            <div className='mt-24 ml-8 w-[75rem] relative'>
                <div>
                    <h1 className='text-purple-500 font-bold text-[1.5rem]'>Adres Bilgileri</h1>
                    <p className='mt-4 font-bold text-blue-400'>{lastSelectedAddress?.title}</p>
                </div>
                <div className='flex mt-12'>
                    <p className='px-2 text-white font-bold text-[1.1rem] bg-purple-400 rounded-full mr-2'>!</p>
                    <p className='font-bold '>Kurumsal Faturalı alışveriş yapmak için "Faturamı Aynı Adrese Gönder" tikini kaldırın ve Fatura adresi olarak kayıtlı kurumsal Fatura adresinizi seçin.</p>
                </div>
                <div className='mt-8'>
                    <div className='flex justify-between'>
                        <h1 className='text-black font-bold text-[1.2rem]'>Teslimat Adresi</h1>
                        <label className='font-bold text-black'>
                            <input type='checkbox' className='mr-2' />
                            Fatura adresime gönder
                        </label>
                    </div>
                    <div className='flex flex-wrap gap-4 justify-between mt-10'>

                        <div onClick={() => setTrueOrFalse(true)} className='w-[30rem] h-[10rem] border-2 cursor-pointer'>
                            <p className='text-[2rem] text-orange-500 font-bold text-center mt-8'>+</p>
                            <p className='font-bold text-black text-center '>Yeni Adres Ekle</p>
                        </div>
                        {addressArray?.map((each, i) => (
                            <div className='w-[30rem] h-[10rem] border-2 pl-4 pt-2 cursor-pointer' key={i}>
                                <label>
                                    <input type='radio' checked={selectedItem === i} onChange={() => handleRadioChange(i)} />
                                    Seç
                                </label>
                                <div className='flex justify-between mr-8 mt-4'>
                                    <h1 className='font-bold text-black'>{each?.name}</h1>
                                    <p className='text-black font-semibold'>{each?.phone}</p>
                                </div>
                                <div>
                                    <p className='mt-2 font-bold text-black'>{each?.address}</p>
                                    <p className='mt-2 font-bold text-black'>{each?.neighborhood} / {each?.city}</p>
                                </div>
                            </div>
                        ))}
                        {isTrueOrFalse &&
                            <div className='w-[30rem] mx-auto absolute left-[30rem] top-[10rem] bg-[#e2e8f0]'>
                                <p className='text-purple-500 font-bold text-[1.5rem] mb-6'>Add New Address</p>
                                <form className='flex gap-4 flex-wrap' onSubmit={handleSubmit(onSubmit)}>
                                    <label className='flex gap-4 text-[1.2rem] font-bold text-orange-400'>Address Title:
                                        <input className='border-2' type="text"  {...register("title", {})} />
                                    </label>
                                    <label className='flex gap-4 font-bold text-orange-400'>Name :
                                        <input className='border-2' type="text"  {...register("name", {})} />
                                    </label>
                                    <label className='flex gap-4 font-bold text-orange-400'>Surname:
                                        <input className='border-2' type="text"  {...register("surname", {})} />
                                    </label>
                                    <label className='flex gap-4 font-bold text-orange-400'>Phone:
                                        <input className='border-2' type="text" {...register("phone", {})} />
                                    </label>
                                    <label className='flex gap-4 font-bold text-orange-400'>City:
                                        <select className='text-black' {...register("city")}>
                                            <option value="Ankara">Ankara</option>
                                            <option value="İzmir">İzmir</option>
                                            <option value="Kayseri">Kayseri</option>
                                            <option value="İstanbul">İstanbul</option>

                                        </select>
                                    </label>
                                    <label className='flex gap-4 font-bold text-orange-400'>District:
                                        <input className='border-2' type="text"  {...register("district", {})} />
                                    </label>
                                    <label className='flex gap-4 font-bold text-orange-400'>Neighborhood:
                                        <input className='border-2' type="text" {...register("neighborhood", {})} />
                                    </label>
                                    <label className='flex gap-4 font-bold text-orange-400'>Address 2:
                                        <input className='border-2' type='text' {...register("address", {})} />
                                    </label>
                                    <button onClick={() => setNewAddress(true)} className='bg-green-600 text-white font-bold px-[13.8rem] mx-auto py-4 rounded-md ' type='submit'>Save</button>
                                </form>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <OrderSummary />
        </div>
    )
}
