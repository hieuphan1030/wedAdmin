import React, { useState } from "react";
import TutorialDataService from "../services/TutorialService";
import { useNavigate } from "react-router-dom";
import { storage } from "../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import MultiSelect from "react-multi-select-component";
import LoadingSpinner from "./LoadingSpinner";

const AddMovie = () => {
    const initialTutorialState = {
        id: null,
        name: "",
        age: 16,
        vote: 5,
        introduce: "",
        date: "",
        turmover: 0,
        time: 180,
        key_youtube: "",
        name_youtube: "",
        categorys: [],
        company: "",
        country: "",
        url: ""
    };
    const [eventImg, setEventImg] = useState({
        image: null,
        progress: 0,
    })
    const [tutorial, setTutorial] = useState(initialTutorialState);
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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

    const options = [
        { label: "Phim Hoạt Hình", value: "HoatHinh" },
        { label: "Phim Hành Động ", value: "HanhDong" },
        { label: "Phim Phiêu Lưu", value: "PhieuLuu" },
        { label: "Phim Hài", value: "Hai" },
        { label: "Phim Hình Sự", value: "HinhSu" },
        { label: "Phim Tài Liệu", value: "TaiLieu" },
        { label: "Phim Gia Đình", value: "GiaDinh" },
        { label: "Phim Lịch Sử", value: "LichSu" },
        { label: "Phim Giả Tưởng", value: "GiaTuong" },
        { label: "Phim kinh Dị", value: "KinhDi" },
        { label: "Lãng Mạng", value: "LangMang" },
        { label: "Phim Khoa Học Viễn Tưởng", value: "KhoaHocVienTuong" },

    ];
    const [selected, setSelected] = useState([]);

    const saveTutorial = () => {
        if (eventImg.image == null) {
            window.confirm('Ảnh không được trống')
        }
        else if (selected.length == 0) {
            window.confirm('Vui lòng chọn thể loại phim')
        }
        else if(tutorial.vote > 10){
            window.confirm('Điểm đánh giá phải nhỏ hơn 10')
        }
        else {
            setIsLoading(true);
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
                    setIsLoading(false);
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
                            company: tutorial.company,
                            country: tutorial.country,
                            categorys: selected,
                            url: downloadURL
                        };

                        TutorialDataService.create(data)
                            .then(response => {
                                setSelected([])
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


    const newTutorial = () => {
        setTutorial(initialTutorialState);
        setSubmitted(false);
    };

    return (

        <div className="submit-form">
            {submitted ? (
                <div>
                    <h4>Thêm phim thành công!</h4>
                    <button className="btn btn-success" onClick={newTutorial}>
                        Thêm phim
                    </button>
                </div>
            ) : isLoading ? <LoadingSpinner /> : (
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
                        {tutorial.vote > 10 ? 
                         <div className="invalid-feedback d-block">
                         Điểm đánh giá phải nhỏ hơn 10!
                       </div>
                       : null}
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
                        <label htmlFor="title">Thời lượng bộ phim (phút)</label>
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
                        <label htmlFor="title">Key youtube </label>
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
                        <label htmlFor="title">Tên youtube (Tên trailer)</label>
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
                    <div>
                        <label htmlFor="title">Thể loại phim</label>
                        <MultiSelect
                            options={options}
                            selected={selected}
                            onChange={setSelected}
                            labelledBy={"Select"}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Tên công ty sản xuất</label>
                        <input
                            type="text"
                            className="form-control"
                            id="company"
                            required
                            value={tutorial.company}
                            onChange={handleInputChange}
                            name="company"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="title">Tên quốc gia sản xuất</label>
                        <input
                            type="text"
                            className="form-control"
                            id="country"
                            required
                            value={tutorial.country}
                            onChange={handleInputChange}
                            name="country"
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
