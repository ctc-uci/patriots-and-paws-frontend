import {
  ChakraProvider,
  Button,
  Image,
  Card,
  CardBody,
  Text,
  Modal,
  useDisclosure,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
/* eslint-disable import/no-extraneous-dependencies */
import { PDFViewer, StyleSheet } from '@react-pdf/renderer';
import './App.css';
import DonationForm from './components/DonationForm/DonationForm';
import DropZone from './components/DropZone/DropZone';
import uploadImage from './utils/FurnitureUtils';
import Drivers from './pages/Dashboard/Drivers';
import DriverRoutes from './pages/Dashboard/DriverRoutes';
import ManageStaff from './pages/ManageStaff/ManageStaff';

import ManageDonationForm from './pages/ManageDonationForm/ManageDonationForm';
import RoutesPage from './pages/RoutesPage/RoutesPage';

import ProtectedRoute from './utils/ProtectedRoute';
import EmailAction from './components/EmailAction/EmailAction';
import CreateAccount from './components/CreateAccount/CreateAccount';
import Login from './components/Login/Login';
import Logout from './components/Logout/Logout';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import Navbar from './components/Navbar/Navbar';

import EmailSending from './components/EmailTemplates/EmailSending';
import InventoryPage from './components/InventoryPage/InventoryPage';
import DriverDashboard from './pages/Dashboard/DriverDashboard';

import RoutePDF from './components/RoutePDF/RoutePDF';

import { AUTH_ROLES } from './utils/config';
import DonorLogin from './pages/DonorLogin/DonorLogin';

const { SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE } = AUTH_ROLES;

function App() {
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);

  // useEffect(() => console.log(files), [files]);

  const onSubmit = async () => {
    const urls = await Promise.all(files.map(async file => uploadImage(file)));
    setImages(prev => [...prev, ...urls]);
    setFiles([]);
  };

  const Playground = () => {
    const styles = StyleSheet.create({
      viewer: {
        width: '100%',
        height: '80vh',
      },
    });
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
      <>
        <EmailSending />
        <DropZone setFiles={setFiles} />
        <Button onClick={onSubmit}>Upload File</Button>
        {images.map(e => (
          <Image key={e} src={e} />
        ))}
        {files.map(({ preview }) => (
          <img
            key={preview}
            alt="pic"
            src={preview}
            // onLoad={() => {
            //   URL.revokeObjectURL(file.preview);
            // }}
          />
        ))}
        <Card m={3}>
          <CardBody>
            <Text>Hi</Text>
          </CardBody>
        </Card>
        <Button mt={4} onClick={onOpen}>
          Export Route
        </Button>
        <Modal isOpen={isOpen} onClose={onClose} size="full">
          <ModalContent>
            <ModalCloseButton />
            <ModalBody p="5em 5em 0 5em">
              <PDFViewer style={styles.viewer}>
                <RoutePDF routeID={3} />
              </PDFViewer>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  };

  const NavBarWrapper = () => (
    <>
      <Navbar />
      <Outlet />
    </>
  );

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route exact path="/playground" element={<Playground />} />

          <Route element={<NavBarWrapper />}>
            <Route
              exact
              path="/"
              element={
                <ProtectedRoute
                  Component={Dashboard}
                  redirectPath="/login"
                  roles={[SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE]}
                />
              }
            />
            <Route
              exact
              path="/register"
              element={
                <ProtectedRoute
                  Component={CreateAccount}
                  redirectPath="/login"
                  roles={[SUPERADMIN_ROLE, ADMIN_ROLE]}
                />
              }
            />
            <Route
              exact
              path="/logout"
              element={
                <ProtectedRoute
                  Component={Logout}
                  redirectPath="/login"
                  roles={[SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE]}
                />
              }
            />
            <Route
              exact
              path="/manage-staff"
              element={
                <ProtectedRoute
                  Component={ManageStaff}
                  redirectPath="/login"
                  roles={[SUPERADMIN_ROLE, ADMIN_ROLE]}
                />
              }
            />
            <Route
              exact
              path="/donate/edit"
              element={
                <ProtectedRoute
                  Component={ManageDonationForm}
                  redirectPath="/login"
                  roles={[SUPERADMIN_ROLE, ADMIN_ROLE]}
                />
              }
            />
            <Route
              path="/routes"
              element={
                <ProtectedRoute
                  Component={RoutesPage}
                  redirectPath="/login"
                  roles={[SUPERADMIN_ROLE, ADMIN_ROLE, DRIVER_ROLE]}
                />
              }
            />
            <Route
              exact
              path="/driver-dashboard"
              element={
                <ProtectedRoute
                  Component={DriverDashboard}
                  redirectPath="/login"
                  roles={[DRIVER_ROLE]}
                />
              }
            />
            <Route exact path="/drivers/:id" element={<Drivers />} />
            <Route exact path="/driver-routes/:id" element={<DriverRoutes />} />
            <Route exact path="/inventory" element={<InventoryPage />} />
          </Route>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/email-action" element={<EmailAction redirectPath="/login" />} />
          <Route exact path="/forgot-password" element={<ForgotPassword />} />

          <Route exact path="/donate" element={<DonorLogin />} />
          <Route exact path="/donate/form" element={<DonationForm />} />
          <Route exact path="/donate/status" element={<DonorLogin />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
