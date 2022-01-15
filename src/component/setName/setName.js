import React, {useState, useEffect} from 'react'
import './setName.css'

export default function SetName({setUserName , close}) {

    const [name, setName] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        const localName = localStorage.getItem('name')
        setName(localName ? localName : '')
    }, [])

    const setNameInLocal = async () => {
        if(!name) {
            setError('ชื่อต้องไม่เว้นว่าง!')
            setInterval(() => {
                setError('')
            },4000)
            return
        }
        await localStorage.setItem('name',name)
        window.location.reload()
    }

    return (
        <div className='name-container'>
            <div className='name-form'>
                <div className='name-form-header'>ตั้งชื่อของคุณ</div>
                <input value={name}
                       type="text"
                       name="name"
                       placeholder='ใส่ชื่อของคุณ..'
                       onChange={(e) => setName(e.target.value)} />
                <div className='name-error'>{error}</div>
                <div className='home-btn'
                     onClick={setNameInLocal}>ตั้งชื่อ</div>
            </div>
        </div>
    )
}
