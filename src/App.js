import './App.css';
import { useState } from 'react';
import { City } from 'country-state-city';
import { ListGroup, Button, Card, Form, InputGroup, CardGroup } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';

export default WeatherForecast;

function WeatherForecast() {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [forecast, setForecast] = useState([]);
  const [cityList, setCityList] = useState([]);

  return (
    <Container id="weather_forecast">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous" />
      <Row>
        <Col>
          <CitySearch city={city} setCity={setCity} setCityList={setCityList}></CitySearch>
          <CityInfo selectedCity={selectedCity} ></CityInfo>
        </Col>
        <Col>
          <CityDropdown cityList={cityList} setForecast={setForecast} setSelectedCity={setSelectedCity}></CityDropdown>
        </Col>
      </Row>
      <Row id="forecast">
        <Col>
          <CityForecast forecast={forecast}></CityForecast>
        </Col>
      </Row>
    </Container>
  );
}

function CityInfo({ selectedCity }) {

  return (
    <div>
      <div>
        City: {selectedCity.name}
      </div>
      <div>
        Region: {selectedCity.region}
      </div>
      <div>
        Country: {selectedCity.country}
      </div>
    </div>
  );

}

function CitySearch({ city, setCity, setCityList }) {

  const [validated, setValidated] = useState(false);

  return (
    <Form onSubmit={searchCities} validated={validated} noValidate>
      <Form.Group as={Row} className="mb-3" controlId="city_finder">
        <Form.Label column sm={1}>City:</Form.Label>
        <Col id="city_input">
          <InputGroup hasValidation className="mb-3">
            <Form.Control type="text" value={city} onChange={handleInput} required />
            <Form.Control.Feedback type="invalid">
              Please provide an input.
            </Form.Control.Feedback>
          </InputGroup>
        </Col>
        <Row>
          <Col>
        <Button variant="info" type="submit" style= {{width: '100%'}}>Search cities</Button>
        </Col>
        </Row>
      </Form.Group>
    </Form>
  );

  function searchCities(event) {

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setValidated(false);
      let filtered_list = City.getAllCities().filter(checkInput).splice(0, 10);

      setCityList(filtered_list);

      function checkInput(town) {
        return town.name.toLowerCase().startsWith(city.toLowerCase());
      }
    }

    event.preventDefault();
    event.stopPropagation();


  }

  function handleInput(e) {

    setCity(e.target.value);

  }
}

function CityDropdown({ cityList, setForecast, setSelectedCity }) {
  if(cityList.length > 0){
  const citySelect = cityList.map((element) => {
    return (
      <ListGroup.Item key={element.name + "-" + element.longitude + "-" + element.latitude}>
        <CityButton cityElement={element} setForecast={setForecast} key={element.name + "-" + element.longitude + "-" + element.latitude} setSelectedCity={setSelectedCity}></CityButton>
      </ListGroup.Item>
    );
  })
  return (
    <ListGroup>
      {citySelect}
    </ListGroup>
  );
  }else{
    return <h2>No cities found</h2>
  }
}

function CityForecast({ forecast }) {
  const dayForecast = forecast.map((element) => {
    return <DayForecast day={element}></DayForecast>
  })

  return (
    <CardGroup>
      {dayForecast}
    </CardGroup>
  );
}

function DayForecast({ day }) {

  const formatted = day.date.split("-");

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={'http:' + day.day.condition.icon} style={{width: '50%', height: '50%', alignSelf: 'center'}}/>
      <Card.Body>
        <Card.Title>{formatted[2] + "/" + formatted[1] + "/" + formatted[0]}</Card.Title>
        <Card.Text>
          <div>
            Max temp: {day.day.maxtemp_c} ºC
          </div>
          <div>
            Min temp: {day.day.mintemp_c} ºC
          </div>
          <div>
            Humidity: {day.day.avghumidity} mm
          </div>
          <div>
            Rain probability: {day.day.daily_chance_of_rain} %
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

function CityButton({ cityElement, setForecast, setSelectedCity }) {

  const getCityForecast = async () => {

    const url = "https://weatherapi-com.p.rapidapi.com/forecast.json?q=" + cityElement.latitude + "," + cityElement.longitude + "&days=3";
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '76d85d31bdmsh407766a3124acf2p1f73fdjsn12bca0d58b9a',
        'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      setForecast(result.forecast.forecastday);
      setSelectedCity(result.location);

      console.log(result);
    } catch (error) {
      console.error(error);
    }

  }

  let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
  return (
    <div>
      <Button onClick={getCityForecast} variant="link">{cityElement.name + ", " + regionNames.of(cityElement.countryCode)}</Button>
    </div>
  );
}


//Mirar si se puede buscar ciudades por una API externa, que la librería le falta algo de información
//Arreglos visuales menores