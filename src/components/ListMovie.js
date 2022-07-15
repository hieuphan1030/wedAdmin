import React, { useState, useEffect, useMemo, useRef } from "react";
import TutorialDataService from "../services/TutorialService";
import { useTable } from "react-table";
import { useNavigate } from "react-router-dom";
const ListMovie = (props) => {
    const [tutorials, setTutorials] = useState([]);
    const [searchTitle, setSearchTitle] = useState("");
    const tutorialsRef = useRef();
    const navigate = useNavigate();
    tutorialsRef.current = tutorials;

    useEffect(() => {
        retrieveTutorials();
    }, []);

    const onChangeSearchTitle = (e) => {
        const searchTitle = e.target.value;
        setSearchTitle(searchTitle);
    };

    const retrieveTutorials = () => {
        TutorialDataService.getAll()
            .then((response) => {
                setTutorials(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };


    const findByTitle = () => {
        TutorialDataService.findByTitle(searchTitle)
            .then((response) => {
                setTutorials(response.data);
                console.log(response.status);
            })
            .catch((e) => {
                console.log(e);
                console.log(e.status);
                setTutorials([]);
            });
    };

    const openTutorial = (rowIndex) => {
        const id = tutorialsRef.current[rowIndex].id;
        navigate(`/movie/${id}`);
    };

    const deleteTutorial = (rowIndex) => {
        if (window.confirm('Bạn có chắc xoá bộ phim này?')) {
            const id = tutorialsRef.current[rowIndex].id;
            TutorialDataService.remove(id)
                .then((response) => {
                    navigate("/movies");
                    let newTutorials = [...tutorialsRef.current];
                    newTutorials.splice(rowIndex, 1);

                    setTutorials(newTutorials);
                })
                .catch((e) => {
                    console.log(e);
                });
            console.log('Thing was saved to the database.');
        } else {
            // Do nothing!
            console.log('Thing was not saved to the database.');
        }

    };

    const columns = useMemo(
        () => [
            {
                Header: "Id",
                accessor: "id",
            },
            {
                Header: "Tên phim",
                accessor: "name",
            },
            {
                Header: "Độ tuổi",
                accessor: "age",
            },
            {
                Header: "Ngày ra mắt",
                accessor: "date",

            },
            {
                Header: "Đánh giá",
                accessor: "vote",

            },
            {
                Header: "Thời lượng phim",
                accessor: "time",

            },
            {
                Header: "Hành động",
                accessor: "actions",
                Cell: (props) => {
                    const rowIdx = props.row.id;
                    return (
                        <div>
                            <span onClick={() => openTutorial(rowIdx)}>
                                <i className="far fa-edit action mr-2"></i>
                            </span>

                            <span onClick={() => deleteTutorial(rowIdx)}>
                                <i className="fas fa-trash action"></i>
                            </span>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data: tutorials,
    });

    return (
        <div className="list row">
            <div className="col-md-8">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm tên phim"
                        value={searchTitle}
                        onChange={onChangeSearchTitle}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={findByTitle}
                        >
                            Tìm Kiếm
                        </button>
                    </div>
                </div>
            </div>
            <div className="col-md-12 list">
                <table
                    className="table table-striped table-bordered"
                    {...getTableProps()}
                >
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps()}>
                                        {column.render("Header")}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {rows.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>


        </div>
    );
};

export default ListMovie;
