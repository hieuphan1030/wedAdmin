import React, { useState } from "react";
import TutorialDataService from "../services/TutorialService";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
const AddMovie = () => {
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
        url: ""
    };
    const [eventImg, setEventImg] = useState({
        image: null,
        progress: 0,
    })
    const [tutorial, setTutorial] = useState(initialTutorialState);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const handleInputChange = event => {
        const { name, value } = event.target;
        setTutorial({ ...tutorial, [name]: value });
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

    const saveTutorial = () => {
        if (eventImg.image == null) {
            window.confirm('Ảnh không được trống')
        }
        else {

            let file = eventImg.image;
            console.log("filename..", file.name)
            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

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
                        var data = {
                            name: tutorial.name,
                            age: Number(tutorial.age),
                            vote: Number(tutorial.vote),
                            introduce: tutorial.introduce,
                            date: tutorial.date,
                            turmover: Number(tutorial.turmover),
                            time: Number(tutorial.time),
                            key_youtube: tutorial.key_youtube,
                            name_youtube: tutorial.name_youtube,
                            url: downloadURL
                        };

                        TutorialDataService.create(data)
                            .then(response => {
                                setTutorial({
                                    id: response.data.id,
                                    name: response.data.name,
                                    age: response.data.age,
                                    vote: response.data.vote,
                                    introduce: response.data.introduce,
                                    date: response.data.date,
                                    turmover: response.data.turmover,
                                    time: response.data.time,
                                    key_youtube: response.data.key_youtube,
                                    name_youtube: response.data.name_youtube,
                                    url: response.data.url
                                });
                                setSubmitted(true);
                                console.log(response.data);
                            })
                            .catch(e => {
                                console.log(e);
                            });
                    });
                }
            );


        }


    };

    const newTutorial = () => {
        setTutorial(initialTutorialState);
        setSubmitted(false);
    };

    return (
        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>You submitted successfully!</h4>
                    <button className="btn btn-success" onClick={newTutorial}>
                        Add
                    </button>
                </div>
            ) : (
                <div>
                    <div className="form-group">
                        <label htmlFor="description">Tên Phim</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            required
                            value={tutorial.name}
                            onChange={handleInputChange}
                            name="name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Tuổi người xem</label>
                        <input
                            type="text"
                            className="form-control"
                            id="age"
                            required
                            value={tutorial.age}
                            onChange={handleInputChange}
                            name="age"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Đánh giá</label>
                        <input
                            type="text"
                            className="form-control"
                            id="vote"
                            required
                            value={tutorial.vote}
                            onChange={handleInputChange}
                            name="vote"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Giới thiệu</label>
                        <textarea
                            type="text"
                            className="form-control"
                            id="introduce"
                            required
                            value={tutorial.introduce}
                            onChange={handleInputChange}
                            name="introduce"
                            rows="5"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Ngày</label>
                        <input
                            type="date"
                            className="form-control"
                            id="date"
                            required
                            value={tutorial.date}
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
                            required
                            value={tutorial.turmover}
                            onChange={handleInputChange}
                            name="turmover"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Thời lượng bộ phim</label>
                        <input
                            type="text"
                            className="form-control"
                            id="time"
                            required
                            value={tutorial.time}
                            onChange={handleInputChange}
                            name="time"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Key youtube</label>
                        <input
                            type="text"
                            className="form-control"
                            id="key_youtube"
                            required
                            value={tutorial.key_youtube}
                            onChange={handleInputChange}
                            name="key_youtube"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Tên youtube</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name_youtube"
                            required
                            value={tutorial.name_youtube}
                            onChange={handleInputChange}
                            name="name_youtube"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Thêm ảnh trong phim</label>
                        <input
                            type="file"
                            className="form-control"
                            id="url"
                            onChange={handleUpload}
                            name="url"
                            accept="image/*"
                        />
                    </div>


                    <button onClick={saveTutorial} className="btn btn-success">
                        Thêm phim
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddMovie;
