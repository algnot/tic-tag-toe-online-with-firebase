import React , {useEffect, useState} from 'react'
import SetName from '../../component/setName/setName'
import './Home.css'
import { firestore } from '../../firebase'

export default function Home() {

    const [name, setName] = useState('')
    const [onCheckSetName, setOnCheckSetName] = useState(false)
    const [createBtn, setCreateBtn] = useState('สร้างเกม')

    useEffect(() => {
        const userName = localStorage.getItem('name')
        setName(userName ? userName : '')
    }, [])

    const createRoom = () => {
        setCreateBtn('กำลังสร้าง..')
        const userKey = localStorage.getItem('key')
        const random = Math.floor(Math.random() * 999999) + 100000
        firestore.collection('ticTac').doc(random.toString())
        .set({
            id : random,
            host : userKey,
            turn : Math.floor(Math.random() * 1),
            content : ['' , '' , '' , '' , '' , '' , '' , '' , ''],
            player : [{name : '' , key : ''} , {name : '' , key : ''}],
            update : new Date().valueOf()
        })
        .then(_ => window.location.href = `./?page=game&room=${random}`)
    }

    return (
        <div className='home-container'>
            {
                onCheckSetName && <SetName setUserName={setName} close={() => setOnCheckSetName(false)}/>
            }
            <div className='home-header'>Tic Tac Toe Online</div>
            <div className='name-error'
                 style={{textAlign:'center'}}>ยินดีต้อนรับกลับ, {name}!</div>
            <div className='home-btn'>เข้าร่วมเกม</div>
            <div className={createBtn == 'สร้างเกม' ?'home-btn' : 'home-btn-active'}
                 onClick={createRoom}>{createBtn}</div>
            <div className='home-btn'
                 onClick={() => {setOnCheckSetName(true)}}>เปลี่ยนชื่อ</div>
        </div>
    )
}
