# Socket.io Playground (in development)

Open-source, cross-platform Socket.io GUI Developer Tool.

### Features

- [x] Multiple socket instances
- [x] Customize queries, headers and authorization options
- [x] Log incoming socket events with supported data types
- [x] Emit socket event back to the server (string data only)
- [ ] Advanced socket option customization
- [ ] Copy & Paste socket options
- [ ] Play sound on incoming socket event
- [ ] Save instances and remember the options on the next launch

### Supported data types
- [x] Integer
- [x] String
- [x] Object
- [x] Array
- [ ] Buffer

## How to develop this project?
Development can be done on Mac, Windows, or Linux as long as you have Node.js installed.

Install the dependencies

```bash
$ npm install
```

Run in development mode

```bash
$ npm run dev
```

Run type checking

```bash
$ npm run typecheck
```

Build to executable

```bash
# For Windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux 
$ npm run build:linux
```
## Known issues
1. The Linux executable cannot be built on an ARM64 machine, so it is recommended to build it on an x86-64 machine,
   which will automatically handle the ARM64 architecture when specified.
2. The Windows executable may display an 'Unknown publisher' message, or the browser may show a false positive message, 
   preventing users from downloading it. Solution is to purchase code signing certificate, but it costs money.
