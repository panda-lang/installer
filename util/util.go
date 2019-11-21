package util

import (
	log "github.com/sirupsen/logrus"
	"io"
	"net/http"
	"os"
)

func DownloadFile(url string, targetFile string) error {
	response, err := http.Get(url)

	if response != nil {
		defer response.Body.Close()
	}

	if err != nil {
		log.Errorln("could not retrieve response from given url", err)
		return err
	}

	out, err := os.Create(targetFile)

	if err != nil {
		log.Errorln("could not create download file", err)
		return err
	}

	_, err = io.Copy(out, response.Body)

	if err != nil {
		log.Errorln("could not copy data into download file", err)
		err = out.Close()

		if err != nil {
			log.Errorln("could not close data file", err)
			return err
		}

		return err
	}

	err = out.Close()
	return err
}
