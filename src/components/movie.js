import React, { useState, useEffect } from "react";
import TutorialDataService from "../services/TutorialService";
import { useParams, useNavigate } from "react-router-dom";
import { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import LoadingSpinner from "./LoadingSpinner";
const Movie = props => {
    const initialTutorialState = {
        id: null,
        name: "",
        age: 16,
        vote: 0,
        introduce: "",
        date: "",
        turmover: 0,
        time: 180,
        key_youtube: "",
        name_youtube: "",
        company: "",
        country: "",
        url: ""
    };
    const [currentTutorial, setCurrentTutorial] = useState(initialTutorialState);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const getTutorial = id => {
        TutorialDataService.get(id)
            .then(response => {
                setCurrentTutorial(response.data);
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    };
    let params = useParams();
    useEffect(() => {
        getTutorial(params.id);
    }, [params.id]);

    const [eventImg, setEventImg] = useState({
        image: null,
        progress: 0,
    })

    const handleInputChange = event => {
        const { name, value } = event.target;
        setCurrentTutorial({ ...currentTutorial, [name]: value });
    };
    const handleUpload = (evt) => {
        if (evt.target.files[0]) {
            setEventImg({
                ...eventImg,
                image: evt.target.files[0]
            })
            //console.log(eventImg); 
        }
    }
    const [isLoading, setIsLoading] = useState(false);
    const updateTutorial = () => {
        setIsLoading(true);
        if (eventImg.image == null) {
            TutorialDataService.update(currentTutorial.id, currentTutorial,)
                .then(response => {
                    console.log(response.data);
                    setMessage("The tutorial was updated successfully!");
                    navigate("/movies")
                    setIsLoading(false);
                })
                .catch(e => {
                    console.log(e);
                    setIsLoading(false);
                });
        }
        if (currentTutorial.vote > 10) {
            window.confirm('??i???m ????nh gi?? ph???i nh??? h??n 10')
        }
        else {
            let file = eventImg.image;
            console.log("filename..", file.name)
            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);
            setIsLoading(true);
            uploadTask.on("state_changed",
                (snapshot) => {
                    const progress =
                        Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    console.log("progress ...", progress)
                },
                (error) => {
                    alert(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log("link:   ", downloadURL)
                        setCurrentTutorial({
                            ...currentTutorial,
                            url: downloadURL
                        })
                        TutorialDataService.update(currentTutorial.id, currentTutorial)
                            .then(response => {
                                console.log(response.data);
                                setMessage("The tutorial was updated successfully!");
                                navigate("/movies")
                                setIsLoading(false);
                            })
                            .catch(e => {
                                console.log(e);
                                setIsLoading(false);
                            });
                    });
                }
            );
        }
    };



    return (
        <div>
            {isLoading ? <LoadingSpinner /> :
                currentTutorial ? (
                    <div className="edit-form">
                        <h4>Th??ng tin phim</h4>
                        <form>
                            <div className="form-group">
                                <label htmlFor="description">T??n Phim</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    required
                                    value={currentTutorial.name}
                                    onChange={handleInputChange}
                                    name="name"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="title">Tu???i ng?????i xem</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="age"
                                    required
                                    value={currentTutorial.age}
                                    onChange={handleInputChange}
                                    name="age"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="title">????nh gi??</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="vote"
                                    value={currentTutorial.vote}
                                    onChange={handleInputChange}
                                    name="vote"
                                />
                                {currentTutorial.vote > 10 ?
                                    <div className="invalid-feedback d-block">
                                        ??i???m ????nh gi?? ph???i nh??? h??n 10!
                                    </div>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="title">Gi???i thi???u</label>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    id="introduce"
                                    value={currentTutorial.introduce}
                                    onChange={handleInputChange}
                                    name="introduce"
                                    rows="5"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="title">Ng??y</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date"
                                    value={currentTutorial.date}
                                    onChange={handleInputChange}
                                    name="date"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="title">Doanh thu</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="turmover"
                                    value={currentTutorial.turmover}
                                    onChange={handleInputChange}
                                    name="turmover"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="title">Th???i l?????ng b??? phim (Ph??t)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="time"
                                    value={currentTutorial.time}
                                    onChange={handleInputChange}
                                    name="time"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="title">Key link youtube</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="key_youtube"
                                    value={currentTutorial.key_youtube}
                                    onChange={handleInputChange}
                                    name="key_youtube"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="title">T??n youtube (T??n trailer)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name_youtube"

                                    value={currentTutorial.name_youtube}
                                    onChange={handleInputChange}
                                    name="name_youtube"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="title">T??n c??ng ty s???n xu???t</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="company"
                                    required
                                    value={currentTutorial.company}
                                    onChange={handleInputChange}
                                    name="company"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="title">T??n qu???c gia s???n xu???t</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="country"
                                    required
                                    value={currentTutorial.country}
                                    onChange={handleInputChange}
                                    name="country"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="title">?????i ???nh trong phim</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    id="url"
                                    onChange={handleUpload}
                                    name="url"
                                    accept="image/*"
                                />
                            </div>
                        </form>

                        <button
                            type="submit"
                            className="badge badge-success"
                            onClick={updateTutorial}
                        >
                            C???p nh???p
                        </button>
                        <p>{message}</p>
                    </div>
                ) :

                    (
                        <div>
                            <br />
                            <p>Please click on a Tutorial...</p>
                        </div>
                    )}
        </div>
    );
};

export default Movie;
