use iced::{canvas::{Canvas}, Sandbox, Settings, Length, Element, Container, Row, Column};

pub fn main() {
    Installer::run(Settings::default())
}

#[derive(Default)]
struct Installer {

}

impl Sandbox for Installer {
    type Message = ();

    fn new() -> Self {
        Self::default()
    }

    fn title(&self) -> String {
        String::from("Panda - Installer")
    }

    fn update(&mut self, _message: Self::Message) {

    }

    fn view(&mut self) -> Element<'_, Self::Message> {
        Column::new()
            .width(Length::Units(900))
            .height(Length::Units(300))
            .padding(20)
            .into()
    }
}