import React , {useEffect, useState} from 'react'
import SetName from '../../component/setName/setName'
import JoinRoom from '../../component/JoinRoom/JoinRoom'
import './Home.css'
import { firestore } from '../../firebase'

export default function Home() {

    const [name, setName] = useState('')
    const [onCheckSetName, setOnCheckSetName] = useState(false)
    const [createBtn, setCreateBtn] = useState('สร้างเกม')

    const [onJoinRoom, setOnJoinRoom] = useState(false)

    useEffect(() => {
        const userName = localStorage.getItem('name')
        setName(userName ? userName : '')
    }, [])

    const createRoom = async () => {
        setCreateBtn('กำลังสร้าง..')
        const userKey = localStorage.getItem('key')
        const random = Math.floor(Math.random() * 999999) + 100000
        await firestore.collection('ticTac').where('host','==',userKey).get()
        .then(docs => {
            docs.forEach(doc => {
                firestore.collection('ticTac').doc(doc.data().id.toString()).delete()
            })
        })
        firestore.collection('ticTac').doc(random.toString())
        .set({
            id : random,
            host : userKey,
            turn : Math.floor(Math.random() * 100) % 2,
            content : ['' , '' , '' , '' , '' , '' , '' , '' , ''],
            player : [{name : '' , key : ''} , {name : '' , key : ''}],
            update : new Date().valueOf(),
            rematch : [false , false]
        })
        .then(_ => window.location.href = `./?page=game&room=${random}`)
    }

    const random = () => {
        const server = firestore.collection('ticTac')
        server.get()
        .then(docs => {
            const random = Math.floor(Math.random() * docs.size)
            window.location.href = `./?page=game&room=${docs.docs[random].data().id}` 
        })
    }

    return (
        <div className='home-container'>
            {
                onCheckSetName && <SetName setUserName={setName} close={() => setOnCheckSetName(false)}/>
            }
            {
                onJoinRoom && <JoinRoom close={() => setOnJoinRoom(false)} />
            }
            <div className='home-header'>Tic Tac Toe Online</div>
            <div className='name-error'
                 style={{textAlign:'center'}}>ยินดีต้อนรับกลับ, {name}!</div>
            <div className='home-btn'
                 onClick={() => {random()}}>สุ่มห้อง</div>
            <div className='home-btn'
                 onClick={() => setOnJoinRoom(true)}>เข้าร่วมเกม</div>
            <div className={createBtn == 'สร้างเกม' ?'home-btn' : 'home-btn-active'}
                 onClick={createRoom}>{createBtn}</div>
            <div className='home-btn'
                 onClick={() => {setOnCheckSetName(true)}}>เปลี่ยนชื่อ</div>
        </div>
    )
}
