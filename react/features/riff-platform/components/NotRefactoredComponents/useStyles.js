import { makeStyles } from '@material-ui/core';

const drawerWidth = 240;

export default makeStyles(theme => {
    return {
        root: {
            display: 'flex',
            backgroundColor: '#282725'
        },
        toolbar: {
            paddingRight: 24 // keep right padding when drawer closed
        },
        toolbarIcon: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 8px',
            ...theme.mixins.toolbar
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create([ 'width', 'margin' ], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            })
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create([ 'width', 'margin' ], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            })
        },
        menuButton: {
            marginRight: 36
        },
        menuButtonHidden: {
            display: 'none'
        },
        title: {
            flexGrow: 1
        },
        drawerPaper: {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen
            })
        },
        drawerPaperClose: {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9)
            }
        },
        appBarSpacer: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
        },
        container: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(4),
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
        },
        mainContainer: {
            flex: 1
        },
        paper: {
            padding: theme.spacing(2),
            display: 'flex',
            overflow: 'auto',
            flexDirection: 'column'
        },
        fixedHeight: {
            height: 240
        },
        seeMore: {
            marginTop: theme.spacing(3)
        },
        meetingButton: {
            marginLeft: '10px',
            visibility: 'hidden'
        },
        tableRow: {
            '&:hover': {
                '& $meetingButton': {
                    visibility: 'visible'
                }
            }
        }
    };
});
