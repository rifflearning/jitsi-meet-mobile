## Riff-platform app
- we created separate app for our admin panel: `react/features/riff-platform`;
- we use it for meeting scheduler, meetings list, auth logic etc;
- we get redirected to that app when we go to `/app/`;
- when we go to meeting `/ROOM_ID`, we check if allowed to participate. If no, then we get redirected to *riff-platform*.

## Navigation in jitsi-meet, riff-platform
- if we put any ID to the location, `/ROOM_ID`, we get to the *jitsi-meet*.
- if we put `/app/` to the location, we get to *riff-platform*.

- we use react-router for navigating in *riff-platform*, routes are here `react/features/riff-platform/components/Main.js`.
- we use changing location to navigate ***with reload*** page **from** *riff-platform* **to** *jitsi-meet*:
```
window.location.replace(ROOM_ID);
```
- we use custom function to navigate ***without reload*** **from** *jitsi-meet* **to** *riff-platform*:
```
navigateWithoutReload(RiffPlatformComponent, `${ROUTES.BASENAME}${ROUTES.DASHBOARD}`)
```

## Checking meetings
When we get to `/ROOM_ID`, we check if we allowed to get to that meeting:
 - if yes, we go to the meeting;
 - if no, we get redirected to /app/waiting/ROOM_ID, where we display the reason why we can't access this room.

When we start meeting from *meetingslist* from *riff-platform*, we get redirected to `/app/waiting/ROOM_ID`, where we check if we allowed to get to that meeting:
 - if no, display error message;
 - if yes, get redirected to `/ROOM_ID` to jitsi-meet app.

## Sibilant 
- we use [@rifflearning/sibilant](https://github.com/rifflearning/sibilant) package for detecting speaking events and send them to the riff-data server for meeting mediator and metrics page

## [Local recording dev notes](react/features/riff-platform/docs/LOCALRECDEVNOTES.md)