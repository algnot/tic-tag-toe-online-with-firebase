import React from 'react'

export default function Winner({playerwinner , player , userview , rematch , rematchChange , leave}) {

    const onGame = player.findIndex(elm => elm.key == userview)

    return (
        <div className='name-container'>
            <div className='name-form'>
                <div className='name-form-header'>
                    {
                        playerwinner.name ? `ผู้ชนะคือ ${playerwinner.name}` : 'เสมอ!'
                    }
                </div>
                {
                    (onGame != -1 && !rematchChange[onGame]) && (
                        <>
                            <div className='home-btn' onClick={() => rematch(userview)}>เล่นอีกครั้ง</div>
                            <div className='home-btn' onClick={() => leave(onGame)}>ออกจากการเเข่ง</div>
                        </>
                    )
                }
                {
                    (onGame != -1 && rematchChange[onGame]) && 
                    <>
                        <div className='name-error' style={{textAlign:'center'}} >
                            ส่งคำขอเล่นอีกครั้งเเล้ว
                        </div>
                        <div className='home-btn' onClick={() => leave(onGame)}>ออกจากการเเข่ง</div>
                    </>
                }
                {
                    (onGame == -1) && 
                    <>
                        <div className='name-error' style={{textAlign:'center'}} >
                            อยู่ระหว่างการ rematch..
                        </div>
                        <div className='home-btn' onClick={() => window.location.href = './'}>ออกจากการเเข่ง</div>
                    </>
                }
            </div>
        </div>
    )
}
