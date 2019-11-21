package impl

import (
	"fmt"
	"github.com/panda-lang/installer/util"
	_ "github.com/sirupsen/logrus"
	"io/ioutil"
	"os"
	"path/filepath"
)

type WindowsInstallation struct {
	path      string
	addToPath bool
}

const pandaDownloadUrl string = "https://repo.panda-lang.org/org/panda-lang/panda/indev-19.11.19/panda-indev-19.11.19-all.jar"

func (w *WindowsInstallation) StartInstall(jsonOptions string) error {
	tempDir, err := ioutil.TempDir("", "panda-installer")
	defer os.RemoveAll(tempDir)

	pandaBinaryPath := filepath.Join(tempDir, "Panda.jar")
	err = util.DownloadFile(pandaDownloadUrl, pandaBinaryPath)

	if err != nil {
		return fmt.Errorf("could not download file from Panda's repository: %s", err)
	}

	defaultSystemInstallationDirectory := os.Getenv("PROGRAMFILES")

	if defaultSystemInstallationDirectory == "" {
		return fmt.Errorf("PROGRAMFILES environment variable does not exists")
	}

	pandaInstallationDirectory := filepath.Join(defaultSystemInstallationDirectory, "Panda")

	err = os.Mkdir(pandaInstallationDirectory, 755)

	if err != nil {
		return fmt.Errorf("could not create Panda installation directory: %s", err)
	}

	input, err := ioutil.ReadFile(pandaBinaryPath)

	if err != nil {
		return fmt.Errorf("could not read downloaded Panda binary from temporary directory: %s", err)
	}

	pandaInstallationBinaryPath := filepath.Join(pandaInstallationDirectory, "Panda.jar")

	err = ioutil.WriteFile(pandaInstallationBinaryPath, input, 755)

	if err != nil {
		return fmt.Errorf("could not copy downloaded Panda binary into installation directory: %s", err)
	}

	return err
}
