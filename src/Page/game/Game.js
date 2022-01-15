import React , {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus , faTimes , faCircleNotch, faUser, faClock } from '@fortawesome/free-solid-svg-icons'
import './Game.css'
import queryString from 'query-string'
import { firestore } from '../../firebase'


export default function Game() {

    const [name, setName] = useState('')
    const [userKey, setUserKey] = useState('')

    const [onUpdate, setOnUpdate] = useState(false)

    const roomId = queryString.parse(window.location.search).room
    const [content, setContent] = useState({
        id : roomId,
        host : '',
        turn : 0,
        content : ['' , '' , '' , '' , '' , '' , '' , '' , ''],
        player : [{name : '' , key : ''} , {name : '' , key : ''}],
    })

    useEffect(() => {
        if(!roomId) {
            window.location.href = './'
        } else {
            const roomRef = firestore.collection('ticTac').doc(roomId)
            roomRef.onSnapshot(doc => {
                if(doc.exists) {
                    setContent(doc.data())
                } else {
                    window.location.href = './'
                }
            })
        }
        const userName = localStorage.getItem('name')
        const userKey = localStorage.getItem('key')
        console.log(userKey);
        setUserKey(userKey)
        setName(userName ? userName : '')
    }, [])

    const update = (player , index) => {
        if(onUpdate) return;
        setOnUpdate(true)

        const contentUpdate = content.content
        contentUpdate[index] = player.toString()

        const roomRef = firestore.collection('ticTac').doc(roomId)
        roomRef.update({
            content : contentUpdate,
            turn : content.turn == 0 ? 1 : 0,
            update : new Date().valueOf()
        })
        .then( _ => setOnUpdate(false))
    }

    const setPlayer = (player, index) => {
        const playerUpdate = content.player
        playerUpdate[index] = {
            key : player,
            name : name
        }
        const roomRef = firestore.collection('ticTac').doc(roomId)
        roomRef.update({
            player : playerUpdate,
            update : new Date().valueOf()
        })
    }

    const leave = (index) => {
        const playerUpdate = content.player
        playerUpdate[index] = {
            key : '',
            name : ''
        }
        const roomRef = firestore.collection('ticTac').doc(roomId)
        roomRef.update({
            player : playerUpdate,
            update : new Date().valueOf(),
            turn : Math.floor(Math.random() * 1),
            content : ['' , '' , '' , '' , '' , '' , '' , '' , '']
        })
    }

    return (
        <div className='game-container'>
            <div className='game-information'>
                <div className='name-error'
                     style={{textAlign:'center',fontSize:20}}>ยินดีต้อนรับกลับ, {name}!</div>
                <div className='name-error'
                     style={{textAlign:'center'}}>รหัสห้อง {roomId}, ตาของ {content.player[content.turn].name}!</div>
                <div className='game-sides'>
                    {
                        content.player.map((data,index) => {
                            const player = content.player.findIndex(elm => elm.key == userKey)
                            if(player == -1) {
                                if(!data.key)
                                    return (
                                        <div className='game-side'
                                             onClick={() => setPlayer(userKey,index)}>
                                            <FontAwesomeIcon icon={faPlus} />
                                            <div>เข้าร่วม</div>
                                        </div>
                                    )
                                else 
                                    return (
                                        <div className='game-side'
                                             onClick={content.host == userKey ? () => leave(index) : ''}>
                                            <FontAwesomeIcon icon={faUser} />
                                            <div>{data.name}</div>
                                        </div>
                                    )
                            } else {
                                if(!data.key)
                                    return (
                                        <div className='game-side-fix'>
                                            <FontAwesomeIcon icon={faClock} />
                                            <div>รอผู้เล่น</div>
                                        </div>
                                    )
                                else 
                                    return (
                                        <div className='game-side'
                                             onClick={(player == index || content.host == userKey) ? () => leave(index) : ''}>
                                            <FontAwesomeIcon icon={faUser} />
                                            <div>{data.name}</div>
                                        </div>
                                    )
                            }
                        })
                    }
                </div>
                <div className='game-board'>
                    {
                       content.content.map((data,index) => {
                            const player = content.player.findIndex(elm => elm.key == userKey)
                            if(player == -1){
                                if(!data)
                                    return (
                                        <div key={index} className='game-board-blank'></div>
                                    )
                                else 
                                    return (
                                        <div key={index} className='game-board-have'>
                                            <FontAwesomeIcon icon={data == 0 ? faCircleNotch : faTimes} />
                                        </div>
                                    )
                            }

                            if(player == content.turn){
                                if(!data)
                                    return (
                                        <div key={index} className='game-board-blank'
                                             onClick={() => update(player,index)}></div>
                                    )
                                else 
                                    return (
                                        <div key={index} className='game-board-have'>
                                            <FontAwesomeIcon icon={data == 0 ? faCircleNotch : faTimes} />
                                        </div>
                                    )
                            }

                            if(player != content.turn){
                                if(!data)
                                    return (
                                        <div key={index} className='game-board-have'></div>
                                    )
                                else 
                                    return (
                                        <div key={index} className='game-board-have'>
                                            <FontAwesomeIcon icon={data == 0 ? faCircleNotch : faTimes} />
                                        </div>
                                    )
                            }

                       }) 
                    }             
                </div>
                <div className='home-btn'>เปลี่ยนชื่อ</div>
            </div>
        </div>
    )
}

