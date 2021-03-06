import React, { Component } from "react";
import API from "../../utils/APIflight";
import { Input, FormBtn } from "../../components/Form";
import { List, ListItem } from "../../components/List";
import DeleteBtn from "../../components/DeleteBtn";
import { Col, Row, Container } from "../../components/Grid";
import {
  Table,
  TableHeader,
  TableRow,
  HeaderCell,
  DataCell,
  TableBody
} from "../../components/Table";
import Nav from "../../components/Nav";
// import { runInThisContext } from "vm";

class Flight extends Component {
  state = {
    origin: "",
    destination: "",
    airline: "",
    results: [],
    current: false
  };

  componentDidMount() {
    // change code so that current is cleared with page load, so write separate function to set current state?
    this.loadAllSearches();
  }

  // to load all searches
  // also grab current search results from this.state.current
  loadAllSearches = () => {
    API.getAllFlights()
      .then(res =>
        this.setState({
          results: res.data,
          current: res.data[0],
          origin: "",
          destination: "",
          airline: ""
        })
      )
      .catch(err => console.log(err));
  };

  deleteSearch = id => {
    API.deleteFlight(id)
      .then(res => this.loadAllSearches())
      .catch(err => console.log(err));
  };

  viewSearch = id => {
    API.viewFlight(id)
      .then(async res => {
        await this.setState({ current: res.data });
        this.loadAllSearches();
      })
      .then(console.log(this.current.results))
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    let { name, value } = event.target;
    value = value.toUpperCase();
    this.setState({ [name]: value });
  };

  // Airline info button popup
  popUp = () => {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  };

  handleFormSubmit = event => {
    event.preventDefault();

    if (this.state.origin.length === 3 && this.state.destination.length === 3) {
      API.saveFlight({
        origin: this.state.origin,
        destination: this.state.destination,
        airline: this.state.airline
      })
        .then(res => this.loadAllSearches())
        .catch(err => console.log(err));
    }
  };

  render() {
    return (
      <main className="wrapper">
        <Nav />
        <section className="section parallax bg1" id="jump">
          <form>
            <label>Origin Airport (required)</label>
            <Input
              onChange={this.handleInputChange}
              value={this.state.origin}
              name="origin"
              placeholder="ex. DEN"
            />
            <label>Destination Airport (required)</label>
            <Input
              onChange={this.handleInputChange}
              value={this.state.destination}
              name="destination"
              placeholder="ex. SYR"
            />
            <FormBtn
              disabled={
                !(
                  this.state.origin.length === 3 &&
                  this.state.destination.length === 3
                )
              }
              onClick={this.handleFormSubmit}
            >
              Get Impact Model
            </FormBtn>
          </form>
          {/* <a href="#jump">Jump to Results</a> */}
        </section>
        <section className="section static results">
          {/* <a id="jump">Jump link destination</a> */}
          {this.state.current ? (
            <Container fluid>
              <Row>
                <Col size="md-2" />
                <Col size="md-8">
                  <h6 className="results">
                    Origin: <strong>{this.state.current.origin}</strong> |
                    Destination:{" "}
                    <strong>{this.state.current.destination}</strong>
                  </h6>
                </Col>
                <Col size="md-2" />
              </Row>
              <Row>
                <Col size="md-2" />
                <Col size="md-8">
                  <br />
                  <h4 className="results">
                    Your contribution to the total greenhouse gas emission of
                    your searched flight is equivalent to...
                  </h4>
                  <br />
                  <List key={this.state.current._id} className="results">
                    <ListItem>
                      <strong>
                        {Math.trunc(
                          this.state.current.cars_off_road_for_day
                            .$numberDecimal
                        )}{" "}
                      </strong>
                      cars off the road for a day
                    </ListItem>
                    <ListItem>
                      <strong>
                        {Math.trunc(
                          this.state.current.days_vegan.$numberDecimal
                        )}{" "}
                      </strong>
                      days of veganism
                    </ListItem>
                    <ListItem>
                      <strong>
                        {Math.trunc(
                          this.state.current.canisters_bbq_propane
                            .$numberDecimal
                        )}{" "}
                      </strong>
                      canisters of BBQ propane
                    </ListItem>
                    <ListItem>
                      <strong>
                        {Math.trunc(
                          this.state.current.recycled_bags_trash.$numberDecimal
                        )}{" "}
                      </strong>
                      recycled bags of trash
                    </ListItem>
                  </List>
                </Col>
                <Col size="md-2" />
              </Row>
            </Container>
          ) : (
            <h3>No Results to Display</h3>
          )}
        </section>
        <section className="section parallax bg2">
          <Container fluid>
            <Row>
              <Col size="md-2" />
              <Col size="md-8">
                <h2>
                  The flight greenhouse gas emission is the anthropogenic
                  greenhouse gas emissions attributed to a single passenger on
                  this flight. It includes CO<sub>2</sub> emissions from
                  combustion of non-biogenic fuel and extra forcing effects of
                  high-altitude fuel combustion.
                </h2>
              </Col>
              <Col size="md-2" />
            </Row>
          </Container>
        </section>
        <section className="section static results">
          {this.state.results.length ? (
            <Container fluid>
              <h4 className="search">Search History</h4>
              <Row>
                <Col size="md-2" />
                <Col size="md-8">
                  <Table>
                    <TableHeader>
                      <HeaderCell />
                      <HeaderCell>Origin</HeaderCell>
                      <HeaderCell>Destination</HeaderCell>
                      {/* <HeaderCell>Airline</HeaderCell> */}
                    </TableHeader>
                    <TableBody>
                      {this.state.results.map(result => (
                        <TableRow key={result._id}>
                          <DataCell>
                            <DeleteBtn
                              data-toggle="tooltip"
                              data-placement="left"
                              title="Click to delete search record"
                              onClick={() => this.deleteSearch(result._id)}
                            />
                            {/* View icon: jump to search form with fields filled in with these parameters */}
                            <a href="#jump">
                              <img
                                className="viewIcon"
                                data-toggle="tooltip"
                                data-placement="bottom"
                                title="Click to jump to search form with these parameters."
                                src="/images/eye.png"
                                alt="Eye icon"
                                onClick={() =>
                                  this.setState({
                                    origin: result.origin,
                                    destination: result.destination
                                  })
                                }
                              />
                            </a>
                            {/* <img
                              className="favIcon"
                              data-toggle="tooltip"
                              data-placement="right"
                              title="COMING SOON! Click to save in favorites"
                              src="/images/heart.png"
                              alt="Heart icon"
                            /> */}
                          </DataCell>
                          <DataCell>{result.origin}</DataCell>
                          <DataCell>{result.destination}</DataCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Col>
                <Col size="md-2" />
              </Row>
            </Container>
          ) : (
            <h3>No Prior Searches to Display</h3>
          )}
        </section>
      </main>
    );
  }
}

export default Flight;
