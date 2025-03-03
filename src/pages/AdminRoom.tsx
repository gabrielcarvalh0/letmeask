import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useParams, useHistory } from 'react-router-dom';
import { database } from '../services/firebase';


import LogoImg from '../assets/images/seueditorLogo.svg'
import { Button } from '../components/Button'
import '../styles/room.scss'
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
// icon
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';

import Modal, {
    ModalHeader,
    ModalBody,
    ModalFooter,

} from '../components/Modal/index'
import { useModal } from '../hooks/useModal';

// types
type RoomParams = {
    id: string;
}

export function AdminRoom() {
    // parametros
    // const { user } = useAuth()
    const params = useParams<RoomParams>();
    const roomId = params.id;

    // hooks
    const { title, questions } = useRoom(roomId);
    const { isShowing, toggle } = useModal();
    const history = useHistory()

    // ESTADOS


    // metodos

    async function handleEndRoom() {
        database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        });
        history.push('/')

    }
    async function handleDeleteQuestion(questionId: string, e: FormEvent) {
        const el = e.target
        if (el) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();

        }

        toggle();


    }


    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={LogoImg} alt="seuLogo" />
                    <div>
                        <RoomCode code={params.id}></RoomCode>
                        <Button onClick={handleEndRoom} isOutlined>Encerrar sala</Button>
                    </div>

                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>


                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                // react identifica a diferença de uma pergunta pra outra
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >

                                <Modal {...{ isShowing, toggle }}>
                                    <ModalHeader {...{ toggle }}>
                                       Excluir comentario
                                    </ModalHeader>
                                    <ModalBody>
                                        Você tem certeza que deseja excluir essa pergunta?
                                    </ModalBody>
                                    <ModalFooter>
                                    
                                        <Button onClick={(e) => handleDeleteQuestion(question.id, e)}>Confirmar</Button>
                                        <button className="btn-cancel" onClick={toggle}>
                                            Cancelar
                                        </button>
                                    </ModalFooter>
                                </Modal>

                                <button onClick={toggle} >
                                    <DeleteIcon></DeleteIcon>
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div >
    )
}