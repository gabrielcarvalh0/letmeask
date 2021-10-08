import * as React from 'react';
import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useParams, useHistory } from 'react-router-dom';
import { database } from '../services/firebase';
import googleIconImg from '../assets/images/iconGoogle.svg'


import LogoImg from '../assets/images/seueditorLogo.svg'
import { Button } from '../components/Button'
import '../styles/room.scss'
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
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
export interface SnackbarMessage {
    message: string;
    key: number;
}

export interface State {
    open: boolean;
    snackPack: readonly SnackbarMessage[];
    messageInfo?: SnackbarMessage;
}

export function Room() {
    // parametros
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { user, signInWithGoogle } = useAuth()

    const { title, questions } = useRoom(roomId);
    const { isShowing, toggle } = useModal();
    const history = useHistory();

    // ESTADOS
    const [newQuestion, setNewQuestion] = useState('');

    const [snackPack, setSnackPack] = React.useState<readonly SnackbarMessage[]>([]);




    // metodos

    async function handleCreateUser() {
        if (!user) {
            await signInWithGoogle();
            history.push(`/profile`);
        }

    }

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            return;
        }
        if (!user) {
            // toast
            toggle();
        }
        if (user) {
            const question = {
                content: newQuestion,
                author: {
                    name: user.name,
                    avatar: user.avatar
                },
                isHighLighted: false,
                // destaque que o adm da
                isAnswered: false
            }
            await database.ref(`rooms/${roomId}/questions`).push(question);
            setNewQuestion('');
        }

    }


    async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
        if (likeId) {
            //  remover o like
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
        } else {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId: user?.id,
            });
        }
    }



    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={LogoImg} alt="seuLogo" />
                    <RoomCode code={params.id}></RoomCode>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="O que você quer perguntar?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    >

                    </textarea>
                    <div className="form-footer">
                        {user ? (

                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button></span>

                        )}
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                // react identifica a diferença de uma pergunta pra outra
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                                <button
                                    className={`like-button ${question.likeId ? 'liked' : ''}`}
                                    type="button"
                                    aria-label="Marcar como gostei"
                                    onClick={() => handleLikeQuestion(question.id, question.likeId)}
                                >
                                    {question.likeCount > 0 && <span>{question.likeCount}</span>}
                                    <ThumbUpAltIcon></ThumbUpAltIcon>
                                </button>

                            </Question>
                        )
                    })}
                </div>
                {
                    user ? (
                        <div></div>

                    ) : (
                        <div className="info-register">
                            <p>Gostou dos conteúdos? Você pode interagir muito mais, basta se cadastrar para poder participar dos comentários. </p>
                        </div>

                    )
                }

            </main>

            <Modal {...{ isShowing, toggle }}>
                <ModalHeader  {...{ toggle }}>
                    <h3> Junte-se para poder interagir
                    </h3>
                </ModalHeader>
                <ModalBody>
                    <div className="main-content">

                        <p>Gostou do conteúdo dessa sala? Junte-se para poder curtir e comentar sobre o assunto.
                        </p>

                        <button onClick={handleCreateUser} className="create-room" >
                            <img src={googleIconImg} alt="logo do Google" />
                            Junte-se com o Google
                        </button>
                    </div>
                </ModalBody>


                <ModalFooter>
                    Já tem uma conta? Entrar
                </ModalFooter>
            </Modal>

        </div >
    )
}