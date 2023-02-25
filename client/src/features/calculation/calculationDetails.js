import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Group } from '@visx/group';
import { Bar } from '@visx/shape';
import { scaleLinear, scaleBand, scaleOrdinal } from '@visx/scale';

import Button from '../../components/Button';
import CalculationSummary from './calculationSummary';
import CurrencyDisplay from '../../components/currencyDisplay';
import Modal from '../../components/ContentModal';

import { closeCalculationModal, postPayment } from './calculationSlice';


class CalculationDetails extends Component {
    render () {
        const personData = this.props.personList.map((person) => {
            const percentResponsible = person.availableIncome / this.props.totalIncome;
            const amountResponsible = percentResponsible * this.props.totalPaid;
            const amountOverpaid = person.paid - amountResponsible;
            return {
                paid: person.paid,
                responsible: amountResponsible,
                overPaid: amountOverpaid,
                name: person.name,
                id: person.id
            }
        });

        console.log(personData);
        
        // Define the graph dimensions and margins
        const width = 500;
        const height = 100;
        const margin = { top: 20, bottom: 20, left: 20, right: 20 };
        
        // Then we'll create some bounds
        const xMax = width - margin.left - margin.right;
        const yMax = height - margin.top - margin.bottom;
        
        // We'll make some helpers to get at the data we want
        const x = d => d.paid;
        const y = d => d.id;
        
        // And then scale the graph by our data
        const xScale = scaleLinear({
            range: [0, xMax],
            round: true,
            domain: [0, this.props.totalPaid],
          });
        const yScale = scaleBand({
          range: [0, yMax],
          round: true,
          domain: personData.map(y)
        });
        const colorScale = scaleOrdinal({
            domain: personData.map(y),
            range: ['blue', 'green']
        });
        
        // Compose together the scale and accessor functions to get point functions
        const compose = (scale, accessor) => personData => scale(accessor(personData));
        const xPoint = compose(xScale, x);
        const yPoint = compose(yScale, y);

        return (
            <Modal showModal={this.props.showModal}>
                <svg width={width} height={height}>
                    {personData.map((d, i) => {
                        const barWidth = xMax - xPoint(d);
                        return (
                            <Group key={`bar-${i}`}>
                                <Bar
                                    x={0}
                                    y={yPoint(d)}
                                    height={yScale.bandwidth()}
                                    width={barWidth}
                                    fill={colorScale(d.id)}
                                />
                            </Group>
                        );
                    })}
                    </svg>

                <div className='calculation-view'>
                    <table className='table is-bordered is-fullwidth'>
                        <thead>
                            <tr>
                                <th />
                                <th>Income</th>
                                <th>Percent</th>
                                <th>Paid</th>
                                <th>Should Pay</th>
                                <th>Difference</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.personList.map((person) => {
                                const percentResponsible = person.availableIncome / this.props.totalIncome;
                                const amountResponsible = percentResponsible * this.props.totalPaid;
                                const amountOverpaid = person.paid - amountResponsible;
                                return <tr key={person.id}>
                                    <td>{person.name}</td>
                                    <td><CurrencyDisplay amount={person.availableIncome} /></td>
                                    <td><CurrencyDisplay amount={percentResponsible} /></td>
                                    <td><CurrencyDisplay amount={person.paid} /></td>
                                    <td><CurrencyDisplay amount={amountResponsible} /></td>
                                    <td><CurrencyDisplay amount={amountOverpaid} /></td>
                                </tr>
                            })}
                            <tr>
                                <td />
                                <td><CurrencyDisplay amount={this.props.totalIncome} /></td>
                                <td />
                                <td><CurrencyDisplay amount={this.props.totalPaid} /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <br />
                <CalculationSummary />
                <div className='buttons is-pulled-right'>
                    <Button onClick={() => this.props.postPayment(this.props.balanceAmount)}>Paid</Button>
                    <Button onClick={() => this.props.closeModal()}>Cancel</Button>
                </div>
            </Modal>
        )
    }
}

export default connect(
    (state) => ({
        showModal: state.calculation.showModal,
        personList: [
            {
                ...state.calculation.payer,
                ...state.persons.list.find((person) => person.id == state.calculation.payer.id)
            },
            {
                ...state.calculation.payee,
                ...state.persons.list.find((person) => person.id == state.calculation.payee.id)
            },
        ],
        balanceAmount: state.calculation.balancingPayment,
        totalIncome: state.persons.list.reduce((partialSum, person) => partialSum + person.availableIncome, 0),
        totalPaid: state.calculation.payer.paid + state.calculation.payee.paid
    }),
    {
        closeModal: closeCalculationModal,
        postPayment
    }
)(CalculationDetails);
