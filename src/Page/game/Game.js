import React , {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus , faTimes , faCircleNotch, faUser, faClock } from '@fortawesome/free-solid-svg-icons'
import './Game.css'
import queryString from 'query-string'
import { firestore } from '../../firebase'
import SetName from '../../component/setName/setName'
import Winner from '../../component/winner/Winner'

export default function Game() {

    const [name, setName] = useState('')
    const [userKey, setUserKey] = useState('')
    const [onCheckSetName, setOnCheckSetName] = useState(false)

    const [onUpdate, setOnUpdate] = useState(false)
    const [isWiner, setisWiner] = useState(false)

    const roomId = queryString.parse(window.location.search).room
    const [content, setContent] = useState({
        id : roomId,
        host : '',
        turn : 0,
        content : ['' , '' , '' , '' , '' , '' , '' , '' , ''],
        player : [{name : '' , key : ''} , {name : '' , key : ''}],
        rematch : [false,false]
    })

    useEffect(() => {
        if(!roomId) {
            window.location.href = './'
        } else {
            const roomRef = firestore.collection('ticTac').doc(roomId)
            roomRef.onSnapshot(doc => {
                if(doc.exists) {
                    setContent(doc.data())
                    if(doc.data().player[0].key || doc.data().player[1].key) checkWinner(doc.data())
                    if(doc.data().rematch[0] && doc.data().rematch[1]) {
                        roomRef.update({
                            update : new Date().valueOf(),
                            content : ['' , '' , '' , '' , '' , '' , '' , '' , ''],
                            turn : Math.floor(Math.random() * 100) % 2,
                            rematch : [false , false]
                        })
                    }
                } else {
                    window.location.href = './'
                }
            })
        }
        const userName = localStorage.getItem('name')
        const userKey = localStorage.getItem('key')
        setUserKey(userKey)
        setName(userName ? userName : '')
    }, [])

    const checkWinner = (content) =>{
        var board = content.content
        var userWin = false 
        if(board[0] == board[1] && board[1] == board[2] &&  board[0]!='' &&  board[1]!='' &&  board[2]!='') 
            userWin = board[0];
        else if(board[3] == board[4] && board[4] == board[5] &&  board[3]!='' &&  board[4]!='' &&  board[5]!='') 
            userWin = board[3];
        else if(board[6] == board[7] && board[7] == board[8] &&  board[6]!='' &&  board[7]!='' &&  board[8]!='') 
            userWin = board[6];
        else if(board[0] == board[3] && board[3] == board[6] &&  board[0]!='' &&  board[3]!='' &&  board[6]!='') 
            userWin = board[0];
        else if(board[1] == board[4] && board[4] == board[7] &&  board[1]!='' &&  board[4]!='' &&  board[7]!='')
            userWin = board[1]; 
        else if(board[2] == board[5] && board[5] == board[8] &&  board[2]!='' &&  board[5]!='' &&  board[8]!='')
            userWin = board[2]; 
        else if(board[0] == board[4] && board[4] == board[8] &&  board[0]!='' &&  board[4]!='' &&  board[8]!='')
            userWin = board[0]; 
        else if(board[4] == board[6] && board[6] == board[2] &&  board[4]!='' &&  board[6]!='' &&  board[2]!='')
            userWin = board[4]; 
        if(userWin) setisWiner(content.player[userWin])
        if(board.findIndex(elm => elm == '') == -1){
            setisWiner({
                name : false,
                key : false
            })
        }
    }

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
            name : name,
        }
        const roomRef = firestore.collection('ticTac').doc(roomId)
        roomRef.update({
            player : playerUpdate,
            update : new Date().valueOf(),
            turn : Math.floor(Math.random() * 100) % 2,
        })
    }

    const leave = (index) => {
        const playerUpdate = content.player
        playerUpdate[index] = {
            key : '',
            name : '',
            rematch : [false,false]
        }
        const roomRef = firestore.collection('ticTac').doc(roomId)
        roomRef.update({
            player : playerUpdate,
            update : new Date().valueOf(),
            content : ['' , '' , '' , '' , '' , '' , '' , '' , '']
        })
    }

    const rematch = (userkey) => {
        const player = content.player.findIndex(elm => elm.key == userkey)
        const roomRef = firestore.collection('ticTac').doc(roomId)
        const playerUpdate = content.rematch
        playerUpdate[player] = true
        roomRef.update({
            rematch : playerUpdate
        })
    }

    return (
        <div className='game-container'>
            {
                onCheckSetName && <SetName setUserName={setName} close={() => setOnCheckSetName(false)}/>
            }
            {
                isWiner && <Winner playerwinner={isWiner} player={content.player} 
                                   userview={userKey} rematch={rematch}
                                   rematchChange={content.rematch} leave={leave}/>
            }
            <div className='game-information'>
                <div className='name-error'
                     style={{textAlign:'center',fontSize:20}}>ยินดีต้อนรับกลับ, {name}!</div>
                <div className='name-error'
                     style={{textAlign:'center'}}>
                         รหัสห้อง {roomId}
                         {
                            (content.player[content.turn].name && content.player[content.turn].key !=  userKey
                            && !content.player.find(elm => elm.key == '')) 
                            && `, ตาของ ${content.player[content.turn].name}!`
                         }
                         {
                            (content.player[content.turn].name && content.player[content.turn].key ==  userKey
                            && !content.player.find(elm => elm.key == '')) 
                            && `, ตาของ คุณ!`
                         }
                </div>
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
                                             onClick={() => update(player,index)}>
                                            <FontAwesomeIcon icon={player == 0 ? faCircleNotch : faTimes} />
                                        </div>
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
                <div className='home-btn'
                     onClick={() => setOnCheckSetName(true)}>เปลี่ยนชื่อ</div>
                <div className='home-btn'
                     onClick={() => window.location.href = './'}>หน้าหลัก</div>
                <div className='name-error'
                     style={{textAlign:'center',fontSize:15}}>
                    {
                        content.host==userKey && '*คุณคือเจ้าของห้อง'
                    }
                </div>
            </div>
        </div>
    )
}

