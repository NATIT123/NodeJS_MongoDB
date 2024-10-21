const express = require('express');

const routerAPI = express.Router();

const { getUsersAPI, postCreateUserAPI,
    putUpdateUserAPI, deleteUserAPI,
    postUploadSingleFileApi,
    postUploadMultipleFilesAPI,

} = require('../controllers/apiController')

const { postCreateCustomer,
    postCreateArrayCustomer,
    getAllCustomers,
    putUpdateCustomers,
    deleteACustomer,
    deleteArrayCustomer
} = require('../controllers/customerController');

const {
    postCreateProject, getAllProject,
    updateProject, deleteProject
} = require('../controllers/projectController');

const { postCreateTask, updateTask,
    deleteTask, getAllTask

} = require("../controllers/taskController");

routerAPI.get('/users', getUsersAPI);
routerAPI.post('/users', postCreateUserAPI);
routerAPI.put('/users', putUpdateUserAPI);
routerAPI.delete('/users', deleteUserAPI);

routerAPI.post('/file', postUploadSingleFileApi);
routerAPI.post('/files', postUploadMultipleFilesAPI);

routerAPI.post('/customers', postCreateCustomer);
routerAPI.post('/customers-many', postCreateArrayCustomer);
routerAPI.get('/customers', getAllCustomers);
routerAPI.put('/customers', putUpdateCustomers);
routerAPI.delete('/customers', deleteACustomer);
routerAPI.delete('/customers-many', deleteArrayCustomer);

routerAPI.get('/projects', getAllProject);
routerAPI.post('/projects', postCreateProject);
routerAPI.put('/projects', updateProject);
routerAPI.delete('/projects', deleteProject);


routerAPI.get('/tasks', getAllTask);
routerAPI.post('/tasks', postCreateTask);
routerAPI.put('/tasks', updateTask);
routerAPI.delete('/tasks', deleteTask);

routerAPI.get('/info', (req, res) => {
    return res.status(200).json({
        data: req.query
    })
});

routerAPI.get('/info/:name/:adress', (req, res) => {
    return res.status(200).json({
        data: req.params
    })
});



module.exports = routerAPI; //export default