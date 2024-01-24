package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strings"

	socketio "github.com/googollee/go-socket.io"
	"github.com/gorilla/mux"
)

func main() {

	type Users struct {
		username string
		roomname string
	}

	type userMsg struct {
		username string
		roomname string
		message  string
	}

	allUsers := make(map[string][]string)
	//defining the webapp server
	server := socketio.NewServer(nil)

	//defining server action when a new connection is established
	server.OnConnect("/", func(s socketio.Conn) error {

		server.OnEvent("/", "new-user", func(data Users) {
			individualUser := make(map[string]string)
			individualUser[s.ID()] = data.username

			resList, exists := allUsers[data.roomname]

			if exists {
				allUsers[data.roomname] = append(resList, data.username)
			} else {
				allUsers[data.roomname] = []string{data.username}
			}

			//joining the socket
			s.Join(data.roomname)

			//Emitting New Username to Clients in that socket
			server.BroadcastToRoom("/", data.roomname, "new-user", map[string]interface{}{"username": data.username})

			// //Send online users array
			server.BroadcastToRoom("/", data.roomname, "online-users", getUsers(allUsers[data.roomname]))
		})
		s.SetContext((""))
		fmt.Println("connected:", s.ID())
		return nil
	})

	server.OnEvent("/room", "message", func(s socketio.Conn, data userMsg) string {
		s.SetContext(data.message)
		server.BroadcastToRoom("/room", data.roomname, "message", map[string]interface{}{
			"username": data.username,
			"message":  data.message,
		})
		return "recv " + data.message
	})

	//Broadcasting the user who is typing
	server.OnEvent("/room", "typing", func(s socketio.Conn, data Users) string {
		s.SetContext("")
		server.BroadcastToRoom("/room", data.roomname, "typing", data.username)
		return "recv " + data.username
	})

	server.OnDisconnect("/", func(s socketio.Conn, reason string) {
		// Get the socket ID and roomname from the connection
		rooms := s.Rooms()
		socketID := s.ID()
		var roomname string
		if len(rooms) > 1 {
			roomname = rooms[1]
		}
		users := allUsers[roomname]
		for i, user := range users {
			if strings.HasPrefix(user, socketID) {
				// Remove the user from the slice
				allUsers[roomname] = append(users[:i], users[i+1:]...)
				break
			}
		}
		log.Printf("Disconnected: %s from room %s\n", socketID, roomname)
	})

	//close the websocket server
	go server.Serve()
	defer server.Close()

	// defining the routers for the webapp
	router := mux.NewRouter()
	router.HandleFunc("/", home)
	router.HandleFunc("/hello", hello)

	http.ListenAndServe(":8080", router)
}

// this function is executed when localhost:8080 is surfed
func home(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("views/index.ejs")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	err = tmpl.Execute(w, "Rishi")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

// this function is executed when localhost:8080/hello is surfed
func hello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, Rishi!")
}

// this function returns the list of online users
func getUsers(userList []string) []string {
	onlineUsers := []string{}
	userIndex := []int{}

	for index, value := range userList {
		onlineUsers = append(onlineUsers, value)
		userIndex = append(userIndex, index)
	}
	log.Printf("User Index: %v", userIndex)
	return onlineUsers
}
