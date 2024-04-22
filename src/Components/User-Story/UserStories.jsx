import React, { useState } from 'react';
import './UserStories.css';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import Tooltip from '@mui/material/Tooltip';
// import { FormControl, InputLabel, Select, MenuItem, Button, Grid } from '@mui/material';
import {
  Button,
  TextField,
  InputLabel,
  FormControl,
  Box,
  Tooltip,
  InputAdornment,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from 'axios';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import Spinner from '../Spinner';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import zIndex from '@mui/material/styles/zIndex';

const UserStories = () => {
  const navigate = useNavigate();
  const featureForOptions = ['End-to-End', 'Front-end', 'Back-end', 'DevOps', 'Testing'];
  const [applicationType, setApplicationType] = useState('');
  const [featureToImplement, setFeatureToImplement] = useState('');
  const [featureFor, setFeatureFor] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isApplicationTypeValid, setIsApplicationTypeValid] = useState(true);
  const [isFeatureToImplementValid, setIsFeatureToImplementValid] = useState(true);
  const [isUserRoleValid, setIsUserRoleValid] = useState(true);
  const [isFeatureForValid, setIsFeatureForValid] = useState(true);
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isResult, setIsResult] = useState(false);
  const [selectedStories, setSelectedStories] = useState([]); // Array to track selected stories for copy
  const [isUserRoleRequired, setIsUserRoleRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDialogStories, setSelectedDialogStories] = useState([]);

  const handleChange = event => {
    const { name, value } = event.target;

    switch (name) {
      case 'applicationType':
        setApplicationType(value);
        setIsApplicationTypeValid(value.trim() !== ''); // Basic validation
        break;
      case 'featureToImplement':
        setFeatureToImplement(value);
        setIsFeatureToImplementValid(value.trim() !== ''); // Basic validation
        break;
      case 'featureFor':
        setFeatureFor(value);
        setIsFeatureForValid(value.trim() !== 'Feature for');
        if (!['End to end', 'Front end', 'Back end'].includes(value)) {
          // alert('T');
          setUserRole('');
          setIsUserRoleValid(true);
        }
        setIsUserRoleRequired(['End-to-End', 'Front-end', 'Back-end'].includes(value));

        break;
      case 'userRole':
        setUserRole(value);
        setIsUserRoleValid(value.trim() !== ''); // Basic validation
        break;
      default:
        break;
    }
  };

  const UserRoleValidatio = () => {
    setIsUserRoleValid(userRole.trim() !== '');
    return userRole.trim() !== '';
  };

  const featureForValidatio = () => {
    // alert(isFeatureToImplementValid);
    setIsFeatureForValid(featureFor.trim() !== '' || featureFor.trim() !== 'feature for');
    return featureFor.trim() !== 'Feature for';
  };

  const ApplicationTypeValidation = () => {
    setIsApplicationTypeValid(applicationType.trim() !== ''); // Basic validation

    return applicationType.trim() !== ''; // Basic validation
  };

  const FeatureValidation = () => {
    // alert('Hiiiiiiiiiii');
    setIsFeatureToImplementValid(featureToImplement.trim() !== ''); // Basic validation

    return featureToImplement.trim() !== ''; // Basic validation
  };

  const backToHome = () => {
    navigate('/');
  };

  const handleGenerateClick = async () => {
    // Validation (adjust to your needs)
    if (!ApplicationTypeValidation() || !FeatureValidation() || !featureForValidatio()) {
      toast.error('Please fill in all required fields.');
      setIsLoading(false);

      return;
    }

    if (isUserRoleRequired) {
      if (!UserRoleValidatio()) {
        toast.error('Please fill in all required fields.');
        return;
      }
    }

    setIsLoading(true);

    // Gather data in an object
    const userStoryData = {
      application_type: applicationType,
      feature: featureToImplement,
      feature_for: featureFor,
      user_role: userRole,
    };

    console.log(userStoryData);

    try {
      const response = await axios.post('https://contentcrafter-python-casestudy.onrender.com/generate-user-story', userStoryData);
      setStories([
        ...stories,
        // { title: `User Stories for ${applicationType} ${featureToImplement} ${stories.length + 1}`, content: response.data },

        { title: `User Stories for ${applicationType} ${featureToImplement} (${featureFor}) `, content: response.data },
      ]);
      setIsResult(true);
      setIsLoading(false);
    } catch (error) {
      toast.error('Error from server');
      console.error('Error generating user story:', error);
      setIsLoading(false);
    }
  };
  const handleReset = () => {
    setApplicationType('');
    setFeatureToImplement('');
    setFeatureFor('');
    setUserRole('');
    setIsApplicationTypeValid(true); // Reset validation states
    setIsFeatureToImplementValid(true);
    setIsUserRoleValid(true);
    setIsUserRoleRequired(false);
    setIsResult(false);
  };
  const handleStoryClick = story => {
    setSelectedStory(story);
    setSelectedDialogStories([]); // Clear selection on dialog open

    console.log(story);
    setOpenModal(true);
  };

  const handleDeleteStory = story => {
    // 1. Filter out the deleted story
    const updatedStories = stories.filter(item => item !== story);
    const updatedSelectedStories = selectedStories.filter(item => item !== story);
    setSelectedStories(updatedSelectedStories);
    if (updatedStories.length == 0) {
      setIsResult(false);
    }

    // 2. Update the 'stories' state
    setStories(updatedStories);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleStorySelection = story => {
    if (selectedStories.includes(story)) {
      setSelectedStories(selectedStories.filter(s => s !== story)); // Remove if already selected
    } else {
      setSelectedStories([...selectedStories, story]); // Add if not selected
    }
  };

  const handleCopySelected = () => {
    if (selectedStories.length === 0) {
      // alert('Please select at least one story');
      toast.info('Please select at least one story');

      return;
    }

    const textToCopy = selectedStories
      .map(story => {
        return story.content.map(item => item.userStory).join('\n\n');
      })
      .join('\n\n');

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => toast.success('Selected stories copied!'))
      .catch(err => console.error('Error copying text:', err));
  };

  const handleSelectAll = () => {
    if (selectedStories.length === stories.length) {
      setSelectedStories([]); // Deselect all
    } else {
      setSelectedStories([...stories]); // Select all
    }
  };

  const handleDialogStorySelection = story => {
    if (selectedDialogStories.includes(story)) {
      setSelectedDialogStories(selectedDialogStories.filter(s => s !== story));
    } else {
      setSelectedDialogStories([...selectedDialogStories, story]);
    }
  };

  const handleDialogDeleteStory = item => {
    // 1. Dialog State Update
    const updatedContent = selectedStory.content.filter(storyItem => storyItem !== item);
    const updatedDialogSelectedStroies = selectedDialogStories.filter(story => story != item);
    setSelectedDialogStories(updatedDialogSelectedStroies);

    // 2. Check for Empty Content
    if (updatedContent.length === 0) {
      // Remove the story from 'stories' entirely
      const updatedStories = stories.filter(story => story.title !== selectedStory.title);
      setStories(updatedStories);

      // Close the dialog (optional)
      handleCloseModal();
    } else {
      // Update states as before
      setSelectedStory({ ...selectedStory, content: updatedContent });

      const updatedStories = stories.map(story => {
        if (story.title === selectedStory.title) {
          return { ...story, content: updatedContent };
        } else {
          return story;
        }
      });
      setStories(updatedStories);
    }
  };

  const handleDialogSelectAll = () => {
    if (selectedDialogStories.length === selectedStory.content.length) {
      setSelectedDialogStories([]); // Deselect all
    } else {
      setSelectedDialogStories([...selectedStory.content]); // Select all
    }
  };

  const handleDialogCopySelected = () => {
    if (selectedDialogStories.length === 0) {
      // alert('Please select at least one story');
      toast.info('Please select at least one story');

      return;
    }

    const textToCopy = selectedDialogStories.map(item => item.userStory).join('\n\n');
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => toast.success('Selected stories copied!'))
      .catch(err => console.error('Error copying text:', err));
  };

  console.log(stories);

  return (
    <>
      <div className="userStoryBody">
        <div className="heading">
          <div className="headerr">
            <button className="back-button" onClick={backToHome}>
              <ArrowBackIosNewIcon style={{ color: 'white' }} />
            </button>
            <div className="title-container">
              <h3>User Stories Generator </h3>
            </div>
          </div>
        </div>
        <div className="main-body">
          <div className="ur-left">
            <div className="application-type">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Tooltip
                  componentsProps={{
                    tooltip: {
                      sx: {
                        fontSize: '13px',
                        marginLeft: '1%',
                        bgcolor: '#007bff',
                        '& .MuiTooltip-arrow': {
                          color: 'common.black',
                        },
                      },
                    },
                  }}
                  title="Ex: Apparel E - commerce store, Food delivery platform, Mobile payment solutions, Personal finance and investment solution, etc.."
                  placement="top"
                  arrow
                >
                  <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
                </Tooltip>
                <FormControl fullWidth className="input-field">
                  <TextField
                    sx={{
                      backgroundColor: 'white',
                    }}
                    id="application-type"
                    label="Application Type *"
                    // placeholder="Application Type"
                    name="applicationType"
                    value={applicationType}
                    onChange={handleChange}
                    error={!isApplicationTypeValid}
                    helperText={isApplicationTypeValid ? '' : 'Application Type is required'}
                    variant="outlined"
                    fullWidth
                  />
                </FormControl>
              </Box>
            </div>
            <div className="second-row">
              <div className="seconf-row-items">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tooltip
                    componentsProps={{
                      tooltip: {
                        sx: {
                          fontSize: '13px',
                          marginLeft: '1%',
                          bgcolor: '#007bff',
                          '& .MuiTooltip-arrow': {
                            color: 'common.black',
                          },
                        },
                      },
                    }}
                    title="Ex: Product search, User registration, Checkout, etc.."
                    placement="top"
                    arrow
                  >
                    <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
                  </Tooltip>
                  <FormControl fullWidth className="input-field">
                    <TextField
                      id="feature-to-implement"
                      label="Feature to Implement *"
                      // placeholder="Feature to Implement"
                      name="featureToImplement"
                      value={featureToImplement}
                      onChange={handleChange}
                      error={!isFeatureToImplementValid}
                      helperText={isFeatureToImplementValid ? '' : 'Feature to Implement is required'}
                      variant="outlined"
                      fullWidth
                    />
                  </FormControl>
                </Box>
              </div>
              <div className="seconf-row-items">
                <FormControl
                  className="input-field"
                  fullWidth
                  error={!isFeatureForValid}
                  sx={{
                    '.MuiOutlinedInput-input': { height: '560px' },
                    '.MuiSelect-select': { height: '450px', display: 'flex', alignItems: 'center' },
                  }}
                >
                  <InputLabel id="feature-for-label">Feature For *</InputLabel>
                  <Select
                    labelId="feature-for-label"
                    id="feature-for"
                    value={featureFor}
                    label="Feature For *"
                    name="featureFor"
                    onChange={handleChange}
                    sx={{ height: '50px', '.MuiOutlinedInput-input': { height: '30px' } }} // Adjust the height here
                    MenuProps={{
                      MenuListProps: {
                        style: {
                          color: 'rgb(97,97,97)', // Change text color
                          fontFamily: 'Roboto, sans-serif', // Change font family
                        },
                      },
                    }}
                  >
                    <MenuItem value="Feature for">{/* <em>Feature for</em> */}</MenuItem>
                    {featureForOptions.map((domain, index) => (
                      <MenuItem key={index} value={domain}>
                        {domain}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <div className="second-row">
              <div className="seconf-row-items">
                {isUserRoleRequired && ( // Only render if required
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip
                      componentsProps={{
                        tooltip: {
                          sx: {
                            fontSize: '13px',
                            marginLeft: '1%',
                            bgcolor: '#007bff',
                            '& .MuiTooltip-arrow': {
                              color: 'common.black',
                            },
                          },
                        },
                      }}
                      title="Ex: Registered User, Logged In User, Guest User, Administrator, Project Manager, etc.."
                      placement="top"
                      arrow
                    >
                      <InfoOutlinedIcon sx={{ fontSize: '1.5rem', color: '#0061af' }} />
                    </Tooltip>
                    <FormControl fullWidth className="input-field">
                      <TextField
                        id="user-role"
                        label="User Role *"
                        // placeholder="User Role"
                        name="userRole"
                        value={userRole}
                        onChange={handleChange}
                        error={!isUserRoleValid}
                        helperText={isUserRoleValid ? '' : 'User Role is required'}
                        variant="outlined"
                        fullWidth
                      />
                    </FormControl>
                  </Box>
                )}
              </div>
            </div>
            <div className="us-button-container">
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: '13px',
                      // marginLeft: '1%',
                      bgcolor: '#007bff',
                      '& .MuiTooltip-arrow': {
                        color: 'common.black',
                      },
                    },
                  },
                }}
                title="Reset"
                arrow
              >
                <Button
                  variant="contained"
                  // onClick={handleReset}
                  // disabled={!isResetEnabled}
                  style={{ maxWidth: '10px', marginRight: '10px' }}
                  onClick={handleReset}
                >
                  <RefreshIcon />
                </Button>
              </Tooltip>
              <Tooltip
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: '13px',
                      // marginLeft: '1%',
                      bgcolor: '#007bff',
                      '& .MuiTooltip-arrow': {
                        color: 'common.black',
                      },
                    },
                  },
                }}
                title="Generate user stories"
                arrow
              >
                <Button variant="contained" type="submit" onClick={handleGenerateClick}>
                  Generate
                </Button>
              </Tooltip>
            </div>
          </div>
          <div className="ur-right">
            {!isResult ? (
              <div className="init">
                Hello there! I'm User Story Generator, your dedicated agent ready to help you transform your application ideas and features
                into technical user-stories.
              </div>
            ) : (
              <></>
            )}

            <>
              {isResult ? (
                <>
                  <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                    <div className="button-copy">
                      <Button
                        variant="outlined" // Or preferred variant
                        onClick={handleSelectAll}
                      >
                        Select All
                      </Button>

                      <Button // Existing Copy Button
                        variant="contained"
                        type="button"
                        onClick={handleCopySelected}
                        // startIcon={<ContentCopyIcon />}
                      >
                        {/* Copy Selected */}
                        <ContentCopyIcon />
                      </Button>
                    </div>
                    {stories.map((story, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {' '}
                        {/* Container with flexbox */}
                        <input type="checkbox" checked={selectedStories.includes(story)} onChange={() => handleStorySelection(story)} />
                        <div className="btn-head">
                          <Button key={index} onClick={() => handleStoryClick(story)} sx={{ margin: 1, justifyContent: 'flex-start' }}>
                            {story.title}
                          </Button>
                          <Button sx={{ margin: '1%' }} aria-label="delete" onClick={() => handleDeleteStory(story)}>
                            <DeleteIcon sx={{ color: 'red' }} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </Box>

                  <Dialog style={{ marginTop: '4%' }} open={openModal} onClose={handleCloseModal}>
                    <DialogTitle>
                      {selectedStory?.title}
                      <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          color: theme => theme.palette.grey[500],
                        }}
                      >
                        <CloseIcon />
                      </IconButton>{' '}
                    </DialogTitle>

                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', gap: '30px', marginLeft: '25px', marginRight: '25px  ' }}
                    >
                      <Button variant="outlined" onClick={handleDialogSelectAll}>
                        Select All
                      </Button>

                      <Button variant="contained" onClick={handleDialogCopySelected}>
                        <ContentCopyIcon />
                      </Button>
                    </div>
                    <DialogContent className="scrollable-card-box" style={{ marginTop: '15px' }}>
                      {selectedStory?.content.map((item, index) => (
                        <Card sx={{ marginBottom: 1, height: '110px' }} key={index}>
                          <CardContent className="scrollable-card-content">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {' '}
                              {/* Container with flexbox */}
                              <Checkbox checked={selectedDialogStories.includes(item)} onChange={() => handleDialogStorySelection(item)} />
                              {item.userStory}
                              <IconButton aria-label="delete" onClick={() => handleDialogDeleteStory(item)}>
                                <DeleteIcon sx={{ color: 'red' }} />
                              </IconButton>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </DialogContent>
                  </Dialog>
                </>
              ) : (
                <></>
              )}
            </>
            {isLoading && <Spinner />}
          </div>
        </div>
      </div>
      ;
      <ToastContainer style={{ zIndex: '10000000' }} />
    </>
  );
};

export default UserStories;
