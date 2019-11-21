package main

import (
	"fmt"
	"github.com/leaanthony/mewn"
	"github.com/panda-lang/installer/impl"
	log "github.com/sirupsen/logrus"
	"github.com/wailsapp/wails"
	"os"
	"runtime"
)

func main() {
	log.SetOutput(os.Stdout)
	log.SetLevel(log.InfoLevel)

	js := mewn.String("./frontend/dist/app.js")
	css := mewn.String("./frontend/dist/app.css")

	app := wails.CreateApp(&wails.AppConfig{
		Width:  1280,
		Height: 720,
		Title:  "Panda Installer",
		JS:     js,
		CSS:    css,
		Colour: "#131313",
	})

	err := app.Run()

	if err != nil {
		panic(err)
	}

	pandaInstallation, err := CreatePandaInstallation()

	if err != nil {
		log.Error(err)
	}

	app.Bind(pandaInstallation)
}

type PandaInstallation interface {
	StartInstall(jsonOptions string) error
	HasAdminPrivileges() bool
}

func CreatePandaInstallation() (PandaInstallation, error) {
	switch runtime.GOOS {
	case "windows":
		return &impl.WindowsInstallation{}, nil
	default:
		return nil, fmt.Errorf("implementation for given operating system is not available")
	}
}
